/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

const fs = require('fs');
const path = require('path');
const rl = require('readline-sync')
const chalk = require("chalk");

module.exports = (projectCommand) => {
    projectCommand
        .command("delete")
        .option("-n, --name <name>", "The name of the project to delete")
        .description("Delete a project")
        .action((options) => {

            if(!options.name) {
                options.name = rl.question(chalk.cyan("Enter the name of the project: "));
            }

            const confirm = rl.keyIn("Are you sure you want to delete this project? (y/n) ", {limit: 'ynYNjnJN'});
            if (confirm.toLowerCase() === "y" || confirm.toLowerCase() === "j") {
                fs.rmSync(path.join(process.cwd(), options.name), {
                    recursive: true,
                    force: true
                });
                console.log(chalk.greenBright("\n  [✓] Successfully deleted project!\n"));
            }
        })
}