const path = require("path");
const util = require("util");

const Inquirer = require('inquirer');
const downloadGitRepo = require("download-git-repo");
const chalk = require("chalk");

const { loading, install } = require("./util");
const { getGuiZhangRepo, getTagsByRepo } = require("./api");

class Creator {
    constructor(name, target) {
        // const { name, target } = props;
        this.name = name;
        this.target = target;
        // download-git-repo不支持promise,借助node的util转化为 promise 方法
        this.downloadGitRepo = util.promisify(downloadGitRepo);
    }

    async create() {
        new Inquirer.prompt([
            {
                name: 'description',
                message: 'Please enter the project description',
              },
              {
                name: 'author',
                message: 'Please enter the project author',
              },
              {
                type: 'list',
                name: 'language',
                message: 'select the develop language',
                choices: ['javaScript', 'typeScript'],
              },
              {
                type: 'list',
                name: 'package',
                message: 'select the package management',
                choices: ['npm', 'yarn'],
              },
        ]).then(async answer => {
            // 仓库信息 —— 模板信息
            let repo = await this.getRepoInfo();
            // 标签信息 —— 版本信息
            let tag = await this.getTagInfo(repo);
            // 下载模版
            await this.download(repo, tag);
            // 模板使用提示
            console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`);
            console.log()
            console.log(chalk.yellowBright('start install dependencies...'))
            // 安装依赖
            await install({
                cwd: path.join(process.cwd(), this.name),
                package: answer.package,
            }).then(() => {
                console.log()
                console.log('We suggest that you begin by typing:')
                console.log()
                console.log(chalk.cyan('  cd'), this.name)
                console.log(`  ${chalk.cyan(`${answer.package} start`)}`)
            })
        });
    }

    /**
     * 获取模板信息及用户选择的模板
     * @returns Promise 模版信息
     */
    async getRepoInfo() {
        let repoList = await loading(
            "waiting for fetching template",
            getGuiZhangRepo
        );
        if (!repoList) return;
        // 提取仓库名
        let repos = repoList.map(item => item.name);
        // 选取模版信息
        let { repo } = await new Inquirer.prompt([
            {
                name: "repo",
                type: "list",
                message: "Please choose a template",
                choices: repos
            }
        ])

        return repo;
    }

    /**
     * 获取版本信息及用户选择的版本
     * @param {string} repo 模板名称
     * @returns Promise 版本信息
     */
    async getTagInfo(repo) {
        let tagList = await loading(
            "waiting for fetching version",
            getTagsByRepo,
            repo
        );
        if (!tagList) return;
        // 获取版本信息
        let tags = tagList.map(item => item.name);
        // 选取版本信息
        let { tag } = await new Inquirer.prompt([
            {
                name: "tag",
                type: "list",
                message: "Please choose a version",
                choices: tags
            }
        ])

        return tag;
    }

    /**
     * 获取版本信息及用户选择的版本
     * @param {string} repo 模板名称
     * @param {string} tag  标签名称
     * @returns Promise 版本信息
     */
    async download(repo, tag) {
        // 模版下载地址
        const templateUrl = `guizhang-cli/${repo}${tag ? "#" + tag : ""}`;
        // 调用 downloadGitRepo 方法将对应模板下载到指定目录
        console.log('templateUrl', templateUrl)
        await loading(
            "downloading template, please wait",
            this.downloadGitRepo,
            templateUrl,
            path.resolve(process.cwd(), this.target)
        )
    }


}

module.exports = Creator;