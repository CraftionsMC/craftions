#!/usr/bin/env node

/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

const fs = require('fs');
const path = require('path');

const {program} = require('commander');
const readline = require("readline");
const packageData = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json")).toString());

console.log = (msg) => {
    process.stdout.write(msg + "\n");
};

program.version(
    packageData.version
)

program.name(
    packageData.name
)

fs.readdirSync(path.join(__dirname, "commands")).forEach(file => {
    if (file.endsWith(".js")) {
        require(path.join(__dirname, "commands", file))(program);
    }
});

program.parse(process.argv);