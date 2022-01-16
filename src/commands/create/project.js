/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

const readline = require('readline-sync');
const chalk = require('chalk');
const fs = require("fs");
const simpleGit = require('simple-git');
const os = require('os');
const path = require('path')
const yarn = require('../../lib/yarn')
const childProcess = require('child_process');

module.exports = (projectCommand) => {
    projectCommand
        .command("project")
        .option("-n, --name <name>", "Name of the new project")
        .option("-d, --display <name>", "Display name of the new project")
        .option("-D, --description <description>", "Description of the new project")
        .option("-t, --template <template>", "Template to use", "CraftionsMC/craftions-base")
        .option("-g, --github <github>", "Github repository to use")
        .option("-s, --skip-instalation", "Skip the installation of dependencies")
        .option("-f, --force", "Force overwrite of existing project")
        .action(async (options, command) => {
            const template = options.template;
            let name = "";
            let display = "";
            let description = "";
            let github = "";

            if (!options.name) {
                name = readline.question(chalk.cyan("Name of the new project: "));
            } else {
                name = options.name;
            }

            if (options.force) {
                fs.rmSync(name, {
                    recursive: true,
                    force: true
                });
            }

            if (fs.existsSync(name)) {
                console.log(chalk.red("Project folder already exists!"));
                return;
            }

            if (!options.display) {
                display = readline.question(chalk.cyan("Display name of the new project: "));
            } else {
                display = options.display;
            }

            if (!options.description) {
                description = readline.question(chalk.cyan("Description of the new project: "));
            } else {
                description = options.description;
            }

            if (!options.github) {
                github = readline.question(chalk.cyan("Github repository to use: "));
            } else {
                github = options.github;
            }

            await simpleGit().clone("https://github.com/" + template + ".git", name)
            await simpleGit(name).remote(["set-url", "origin", github]);

            console.log(chalk.greenBright("\n  [✓] Successfully cloned template!"));

            const yarnData = yarn();

            if (yarnData.installed) {
                console.log(chalk.greenBright("\n  [✓] Found YARN version " + yarnData.version));
            } else {
                console.log(chalk.red("\n  [✗] YARN is not installed using NPM instead."))
            }

            const pkgData = JSON.parse(fs.readFileSync(path.join(name, "package.json")).toString());
            let readmeData = fs.readFileSync(path.join(name, "README.md")).toString();

            pkgData.name = name.toLowerCase();
            pkgData.author = os.userInfo().username;
            pkgData.description = description;

            Object.keys(pkgData.scripts).forEach(key => {
                if(yarnData.installed) {
                    pkgData.scripts[key] = pkgData.scripts[key].replace(/npm run/g, "yarn");
                }
            });

            readmeData = readmeData.replace("# craftions-base", "# " + display);
            readmeData = readmeData.replace("https://github.com/CraftionsMC/craftions-base", github);
            readmeData = readmeData.replace("cd craftions-base", "cd " + github.split("/")[github.split("/").length - 1]);
            readmeData = readmeData.replace("This is the base of all craftions web apps.", description);

            fs.writeFileSync(path.join(name, "package.json"), JSON.stringify(pkgData, null, 2));
            fs.writeFileSync(path.join(name, "README.md"), readmeData);

            console.log(chalk.greenBright("\n  [✓] Successfully patched project!"));

            if(!options.skipInstalation) {

                childProcess.execSync(yarnData.installed ? "yarn install" : "npm install", {
                    cwd: name,
                    stdio: "ignore"
                });

                console.log(chalk.greenBright("\n  [✓] Successfully installed dependencies!"));
            }

            console.log("\n")
        });
}