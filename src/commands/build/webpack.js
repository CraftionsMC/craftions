/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

const readline = require('readline-sync');
const hasDocker = require('../../lib/docker')
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

module.exports = (buildCommand) => {

    buildCommand
        .command("webpack")
        .option("-n, --name <name>", "Name of the project")
        .option("-d, --development", "Use Development Mode", false)
        .action((options) => {
            let name = "";

            if (!options.name) {
                name = readline.question(chalk.cyan("Name of the project: "));
            } else {
                name = options.name;
            }

            if (fs.existsSync(path.join(process.cwd(), name))) {
                childProcess.execSync(`npm run webpack:build-${options.development === true ? "dev" : "prod"}`, {
                    cwd: path.join(process.cwd(), name),
                    stdio: "inherit"
                });

                console.log(chalk.greenBright("\n  [✓] Built " + (options.development === true ? "development" : "production") + " webpack bundle.\n"));
            } else {
                console.log(chalk.red("\n  [✗] Project not found\n"));
            }
        });
}
