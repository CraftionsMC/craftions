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
        .command("docker")
        .option("-P, --push", "Push the image to the registry", false)
        .option("-n, --name <name>", "Name of the image")
        .option("-t, --tag <tag>", "Tag of the image", "latest")
        .option("-p, --project <project>", "Project to build")
        .option("-N, --no-build", "Don't build the project", false)
        .action((options) => {
            if (hasDocker().installed) {
                let name = "";
                let project = "";

                if(!options.name) {
                    name = readline.question(chalk.cyan("Name of the image: "));
                } else {
                    name = options.name;
                }

                if(!options.project) {
                    project = readline.question(chalk.cyan("Project to build: "));
                } else {
                    project = options.project;
                }

                if(fs.existsSync(path.join(process.cwd(), project))) {
                    if(options.build) {
                        childProcess.execSync(`docker build -t ${name}:${options.tag} ${project}`, {
                            cwd: process.cwd(),
                            stdio: "inherit"
                        });

                        console.log(chalk.greenBright("\n  [✓] Built docker image \n"));
                    }

                    if(options.push) {
                        childProcess.execSync(`docker push ${name}:${options.tag}`, {
                            cwd: process.cwd(),
                            stdio: "inherit"
                        });

                        console.log(chalk.greenBright("\n  [✓] Pushed docker image \n"));
                    }

                }else {
                    console.log(chalk.red("\n  [✗] Project not found\n"));
                }

            } else {
                console.log(chalk.red("\n  [✗] Docker is not installed. Download and install docker from ") + chalk.cyanBright("https://www.docker.com/\n"));
            }

        })
}
