/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

const chalk = require('chalk');
const rl = require('readline-sync');
const fs = require("fs");
const path = require("path");

module.exports = (createCommand) => {
    createCommand
        .command("site")
        .description("Create a new site")
        .option("-p, --project <project>", "The project to create the site in")
        .option("-n, --name <name>", "The name of the site")
        .option("-t, --template <template>", "The template to use")
        .option("-l, --list-templates", "List all available templates")
        .action((options) => {
            if(options.listTemplates) {
                console.log(chalk.cyan("Available templates:"));
                console.log("");

                fs.readdirSync(path.join(__dirname, "templates", "sites")).forEach(file => {
                    console.log(chalk.greenBright("* " + file.split(".")[0]));
                });

                console.log("");

                return;
            }

            let name = '';
            let template = '';
            let project = options.project || ".";

            if(!options.name) {
                name = rl.question(chalk.cyan("Enter the name of the site: "));
            } else {
                name = options.name;
            }

            if(!options.template) {
                template = rl.question(chalk.cyan("Enter the template to use: "));
            } else {
                template = options.template;
            }

            if(!fs.existsSync(path.join(__dirname, "templates", "sites", template + ".tmpl"))) {
                console.log(chalk.red("\n  [✗] The selected template does not exist!\n"));
                return;
            }

            const COMPONENTS = path.join(process.cwd(), project, "src", "views");
            const COMPONENT_FOLDER = path.join(process.cwd(), project, "src", "views", name);
            const COMPONENT_FILE = path.join(process.cwd(), project, "src", "views", name, name + ".tsx");

            if(!fs.existsSync(COMPONENTS)) {
                console.log(chalk.red("\n  [✗] This is not a craftions project: " + project + "\n"));
                return;
            }

            if(fs.existsSync(COMPONENT_FOLDER) || fs.existsSync(COMPONENT_FILE)) {
                console.log(chalk.red("\n  [✗] The component already exists!\n"));
                return;
            }

            let content = fs.readFileSync(path.join(__dirname, "templates", "sites", template + ".tmpl")).toString();

            content = content.replace(/SiteName/g, name)

            fs.mkdirSync(COMPONENT_FOLDER);
            fs.writeFileSync(COMPONENT_FILE, content);

            console.log(chalk.greenBright("\n  [✓] Created new site \n"));
        })
}