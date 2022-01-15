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
        .command("component")
        .description("Create a new component")
        .option("-p, --project <project>", "The project to create the component in")
        .option("-n, --name <name>", "The name of the component")
        .option("-t, --template <template>", "The template to use")
        .option("-l, --list-templates", "List all available templates")
        .action((options) => {
            if(options.listTemplates) {
                console.log(chalk.cyan("Available templates:"));
                console.log("");

                fs.readdirSync(path.join(__dirname, "templates", "components")).forEach(file => {
                    console.log(chalk.greenBright("* " + file.split(".")[0]));
                });

                console.log("");

                return;
            }

            let name = '';
            let template = '';
            let project = options.project || ".";

            if(!options.name) {
                name = rl.question(chalk.cyan("Enter the name of the component: "));
            } else {
                name = options.name;
            }

            if(!options.template) {
                template = rl.question(chalk.cyan("Enter the template to use: "));
            } else {
                template = options.template;
            }

            if(!fs.existsSync(path.join(__dirname, "templates", "components", template + ".tmpl"))) {
                console.log(chalk.red("\n  [✗] The selected template does not exist!\n"));
                return;
            }

            const COMPONENTS = path.join(process.cwd(), project, "src", "components");
            const COMPONENT_FOLDER = path.join(process.cwd(), project, "src", "components", name);
            const COMPONENT_FILE = path.join(process.cwd(), project, "src", "components", name, name + ".tsx");

            if(!fs.existsSync(COMPONENTS)) {
                console.log(chalk.red("\n  [✗] This is not a craftions project: " + project + "\n"));
                return;
            }

            if(fs.existsSync(COMPONENT_FOLDER) || fs.existsSync(COMPONENT_FILE)) {
                console.log(chalk.red("\n  [✗] The component already exists!\n"));
                return;
            }

            let content = fs.readFileSync(path.join(__dirname, "templates", "components", template + ".tmpl")).toString();

            content = content.replace(/ComponentName/g, name)

            fs.mkdirSync(COMPONENT_FOLDER);
            fs.writeFileSync(COMPONENT_FILE, content);
            fs.writeFileSync(path.join(COMPONENT_FOLDER, name + ".scss"), "." + name + " {\n\n}");

            console.log(chalk.greenBright("\n  [✓] Created new component \n"));
        })
}