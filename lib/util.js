const ora = require("ora");
const spawn = require("cross-spawn");

/**
 * 睡觉函数
 * @param {Number} n 睡眠时间
 */
function sleep(n) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, n);
    });
}

/**
 * loading加载效果
 * @param {String} message 加载信息
 * @param {Function} fn 加载函数
 * @param {List} args fn 函数执行的参数
 * @returns 异步调用返回值
 */
async function loading(message, fn, ...args) {
    const spinner = ora(message);
    spinner.start(); // 开启加载

    try {
        let executeRes = await fn(...args);
        spinner.succeed();
        return executeRes;
    } catch (error) {
        console.log('error', error);
        spinner.fail("request fail, reTrying");
        await sleep(1000);
        return loading(message, fn, ...args);
    }
}

/**
 * 脚手架项目安装依赖
 * @param {String} message 加载信息
 * @param {Function} fn 加载函数
 * @param {List} args fn 函数执行的参数
 * @returns 异步调用返回值
 */
async function install(options) {
    const cwd = options.cwd;

    return new Promise((resolve, reject) => {
        const command = options.package;
        const args = ['install', '--save', '--save-exact', '--loglevel', 'error'];
        const child = spawn(command, args, {
            cwd,
            stdio: ['pipe', process.stdout, process.stderr],
        });

        child.once('close', function(code){
            if(code != 0) {
                reject({
                    command: `${command} ${args.join(' ')}`,
                })
                return
            }
            
            resolve();
        })

        child.once('error', reject)
    })
}

module.exports = {
    loading,
    install
};

