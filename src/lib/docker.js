/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

const chalk = require('chalk');
const childProcess = require('child_process');

function checkDocker() {
    let output;

    try {
        output = childProcess.execSync("docker --version", {
            stdio: "pipe",
            cwd: process.cwd()
        });
    }catch (e) { }

    if(output === undefined) {
        return {
            installed: false,
            version: "N/A"
        };
    } else {
        return {
            installed: true,
            version: output.toString().trim()
        };
    }
}


module.exports = checkDocker;