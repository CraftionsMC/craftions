/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

const fs = require("fs");
const path = require("path");

function patch(name, p) {
    const packageJSON = JSON.parse(fs.readFileSync(path.join(p, "package.json")).toString());

    packageJSON.name = "@craftions/" + name;

    packageJSON.repository.url = "https://github.com/CraftionsMC/" + name;
    packageJSON.homepage =
        "https://github.com/CraftionsMC/" + name + "#readme";

    packageJSON.bugs.url =
        "https://github.com/CraftionsMC/" + name + "/issues";

    packageJSON.scripts["docker:build"] = packageJSON.scripts[
        "docker:build"
        ].replace("mctzock/craftions-base", "mctzock/" + name);

    packageJSON.scripts["docker:deploy"] = packageJSON.scripts[
        "docker:deploy"
        ].replace("mctzock/craftions-base", "mctzock/" + name);

    packageJSON.scripts["docker:run"] = packageJSON.scripts[
        "docker:run"
        ].replace("mctzock/craftions-base", "mctzock/" + name);

    packageJSON.scripts["docker:run"] = packageJSON.scripts[
        "docker:run"
        ].replace("craftions-base", name);

    fs.writeFileSync(path.join(p, "package.json"), JSON.stringify(packageJSON));

    let readme = fs.readFileSync(path.join(p, "README.MD")).toString();

    readme = readme.replace(/craftions-base/g, name);

    fs.writeFileSync(path.join(p, "README.MD"), readme);
}

module.exports = {patch};
