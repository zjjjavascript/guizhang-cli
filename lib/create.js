const path = require("path");
const fs = require("fs-extra");
const Inquirer = require("inquirer");
const Creator = require("./Creator");

module.exports = async function (projectName, options) {
    // 获取当前目录
    const cwd = process.cwd();
    // 拼接得到项目目录
    const targetDirectory = path.join(cwd, projectName);
    // 判断目录是否存在
    if (fs.existsSync(targetDirectory)) {
        // 判断是否使用force参数
        if (options.force) {
            // 删除同名目录
            await fs.remove(targetDirectory)
        } else {
            let { isOverwrite } = await new Inquirer.prompt([
                {
                    name: "isOverwrite", // 与返回值对应
                    type: "list", // list 类型
                    message: "Target directory exists, Please choose an action",
                    choices: [
                        { name: "Overwrite", value: true },
                        { name: "Cancel", value: false },
                    ],
                }
            ]);

            if (isOverwrite) {
                // 选择 Overwirte ，先删除掉原有重名目录
                console.log("\r\nRemoving");
                await fs.remove(targetDirectory);
            }else {
                console.log("Cancel");
                return;
            }
        }
    }

    // 创建项目
    const creator = new Creator(projectName, targetDirectory);

    creator.create();
}