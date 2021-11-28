#!/usr/bin/env node

/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

const {program} = require('commander')
const chalk = require('chalk');
const fs = require('fs');
const {execSync} = require('child_process')
const path = require('path');
const simpleGit = require('simple-git');
const git = simpleGit();
const {patch} = require('./lib/patchApp');
const {checkYarn} = require("./lib/checkYarn");
const {NOOP} = require("simple-git/src/lib/utils");

const version = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json")).toString()).version

program.version(version);

program
    .command("create <name>")
    .option("-n, --no-install", "Don't install the dependencies")
    .description("Create a new Craftions App")
    .action((name, options, command) => {
        if (fs.existsSync(name)) {
            console.log(chalk.red(`The name ${name} is already taken!`));
            process.exit(1)
        }
        console.log(chalk.green(`Craftions CLI ${version}`));
        console.log(`Creating new Craftions App in ${name}...`);

        let remotePath = "https://github.com/CraftionsMC/craftions-base";

        console.log(chalk.yellow(`Cloning from template ${remotePath}...`));

        git.clone(remotePath, name).then(x => {
            console.log(chalk.green(`Successfully cloned!`));

            console.log(chalk.yellow("Patching App..."));

            patch(name, path.join(process.cwd(), name));
            console.log(chalk.green(`Successfully patched app!`));

            if(options.install){
                console.log(chalk.yellow("Getting Package Manager..."));
                let pManager = "yarn";

                if(!checkYarn()) {
                    pManager = "npm";
                }

                console.log(chalk.yellow(`Installing Dependencies using ${pManager}...`));

                execSync(pManager === "yarn" ? "yarn && yarn install" : "npm install", {
                    stdio: "inherit",
                    cwd: path.join(process.cwd(), name)
                })
            }

            console.log(chalk.cyan(fs.readFileSync(path.join(__dirname, "art", "ascii_craftions.txt").toString())));
            console.log(chalk.cyan("Happy Coding!"));
            console.log("\n")

            console.log(chalk.green("You can start your app using ") + chalk.yellow("craftions run " + name))
            console.log(chalk.green("For additional functionality run ") + chalk.yellow("craftions --help"))

            console.log("\n");

        })
    })

program
    .command("run <name>")
    .option("-s, --script <script_name>", "Specify a custom npm script that will be executed", "express:live-start")
    .option("-d, --docker", "Build and run a Docker Container with your Craftions App.", false)
    .description("Run a Craftions App")
    .action((name, options, command) => {
        if (!fs.existsSync(name)) {
            console.log(chalk.red(`The app ${name} could not be found!`));
            process.exit(1)
        }

        if(!options.docker){
            const task = options.script;

            console.log(chalk.green(`Starting the app ${name} on http://localhost:3000...`))
            execSync(`npm run ${task}`, {
                stdio: "inherit",
                cwd: name
            })
        }else {
            console.log(chalk.green(`Building Docker Container... It will run on http://localhost:8080`))
            execSync(`npm run docker:build && npm run docker:run`, {
                stdio: "inherit",
                cwd: name
            })
        }

    })

program
    .command("build <name>")
    .description("Build a Docker Container with your Craftions App")
    .option("-r, --run", "Run the built container.")
    .action((name, options, command) => {
        if (!fs.existsSync(name)) {
            console.log(chalk.red(`The app ${name} could not be found!`));
            process.exit(1)
        }
        console.log(chalk.green(`Building Docker Container...`))
        execSync(`npm run docker:build`, {
            stdio: "inherit",
            cwd: name
        })

        if(options.run){
            console.log(chalk.green(`Running your docker container on http://localhost:8080...`))
            execSync(`npm run docker:run`, {
                stdio: "inherit",
                cwd: name
            })
        }
    })

program.parse(process.argv);