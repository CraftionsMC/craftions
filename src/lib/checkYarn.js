/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

const chalk = require("chalk");
const childProcess = require('child_process');

function checkYarn() {
    let output;

    try {
        output = childProcess.execSync("yarn --version", {
            stdio: "pipe",
            cwd: process.cwd()
        });
    }catch (e) { }

    if(output === undefined) {
        console.log(chalk.red("yarn is not installed. Using NPM instead"))
        return false;
    } else {
        console.log(chalk.green(`Installed yarn Version: ${output}`));
        return true;
    }
}

module.exports = {checkYarn}