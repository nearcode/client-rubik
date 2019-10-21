// 获取参数列表
module.exports = function getArgList() {
    let argvs;
    let res = {};
    //下面的步骤就是获取命令行参数。
    try {
        argvs = JSON.parse(process.env.npm_config_argv).original;
    } catch (ex) {
        argvs = process.argv; //返回命令脚本中各个参数所组成的数组
    }
    let argv = argvs.slice(2);
    for (let i in argv) {
        let key = argv[i].match(/-(\S*)=/)[1];
        let value = argv[i].split('=')[1];
        res[key] = value;
    }
    return res;
};
