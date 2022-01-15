/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

const fs = require('fs');
const path = require('path');
const rl = require('readline-sync')
const chalk = require("chalk");
const childProcess = require("child_process");

module.exports = (projectCommand) => {
    projectCommand
        .command("run")
        .option("-n, --name <name>", "The name of the project to run")
        .option("-s, --custom-script <script>", "The script to run", "express:live-start")
        .description("Run a project")
        .action((options) => {

            if(!options.name) {
                options.name = rl.question("Enter the name of the project: ");
            }
            console.log("\n");

            const projectPath = path.join(process.cwd(), options.name);
            const packageJson = require(path.join(projectPath, "package.json"));
            const scripts = packageJson.scripts;
            const script = scripts[options.customScript];
            if(!script) {
                console.log(chalk.red("  [✗] The script " + options.customScript + " does not exist in the package.json\n"));
                return;
            }

            const command = script.split(" ")[0];
            const args = script.split(" ").slice(1);
            const commandPath = path.join(projectPath, "node_modules", ".bin", command);

            if(!fs.existsSync(commandPath)) {
                console.log(chalk.red("  [✗] The command " + command + " does not exist in the node_modules\n"));
                return;
            }

            const commandArgs = args.join(" ");
            const commandString = commandPath + " " + commandArgs;

            console.log(chalk.greenBright("  [✓] Running " + commandString + "\n"));

            childProcess.execSync(commandString, {
                cwd: projectPath,
                stdio: "inherit"
            })
        })
}