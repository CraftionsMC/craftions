/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

const fs = require("fs");
const path = require("path");

module.exports = (program) => {

    const projectCommand = program
        .command("build");

    fs.readdirSync(path.join(__dirname, "build")).forEach(file => {
        if(file.endsWith(".js")) {
            require(path.join(__dirname, "build", file))(projectCommand);
        }
    })
}