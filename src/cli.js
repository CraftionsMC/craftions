#!/usr/bin/env node

/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

const {program} = require('commander')
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const git = require('simple-git');

program.version(JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json")).toString()).version);

program
    .command("create <name>")
    .option("-o, --frontend-only")
    .description("Create a new Craftions App")
    .action((name, options, command) => {
        if(fs.existsSync(path.join(__dirname, name))) {

        }
    })

program.parse(process.argv);