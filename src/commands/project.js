/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

const fs = require("fs");
const path = require("path");

module.exports = (program) => {

    const projectCommand = program
        .command("project");

    fs.readdirSync(path.join(__dirname, "project")).forEach(file => {
        require(path.join(__dirname, "project", file))(projectCommand);
    })
}