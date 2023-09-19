#! /usr/bin/env node
const program = require('commander');
const chalk = require("chalk");
const figlet = require("figlet");

console.log(
    "\r\n" +
    figlet.textSync("guizhang", {
        font: "3D-ASCII",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 100,
        whitespaceBreak: true,
    })
);

// 版本号
program.version(`guizhang-cli ${require('../package.json').version}`)
// 创建项目
program
    .command("create <project-name>")
    .description("create a new project") // 添加描述信息
    .option("-f, --force", "overwrite target directory if it exists") // 强制覆盖
    .action((projectName, cmd) => {
        // 处理用户输入create 指令附加的参数
        require("../lib/create")(projectName, cmd);
    });
// config
program
    .command("config [value]") // config 命令
    .description("inspect and modify the config")
    .option("-g, --get <key>", "get value by key")
    .option("-s, --set <key> <value>", "set option[key] is value")
    .option("-d, --delete <key>", "delete option by key")
    .action((value, keys) => {
        // value 可以取到 [value] 值，keys会获取到命令参数
        console.log(value, keys);
    });
// help
program
    .name("guizhang-cli")
    .usage(`<command> [option]`)
    .version(`1.0.0`);
// 提示上色
program.on("--help", function () {
    // 前后两个空行调整格式，更舒适
    console.log();
    console.log(
        `Run ${chalk.cyan(
            "guizhang-cli <command> --help"
        )} for detailed usage of given command.`
    );
    console.log();
});

program.parse(process.argv);