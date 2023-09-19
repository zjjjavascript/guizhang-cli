# guizhang-cli脚手架

## 使用技术

1. commander
2. cross-spawn
3. download-git-repo
4. figlet
5. fs-extra
6. inquirer
7. ora
8. axios

## 构建和设置

``` bash
# install dependencies
npm install guizhang-cli -g

# create project
guizhang-cli create <projectName>

# create project force
guizhang-cli create <projectName> --force

# config project
guizhang-cli config --params

# help
guizhang-cli --help
```

## 注意事项
-  inquirer 9 不支持require，使用8 

-  安装 chalk 时一定要注意安装 4.x 版本

## 项目目录结构  
``` bash
├── bin                                # node服务运行
│   └── enter.js                       # 入口命令
├── lib                                # 依赖项
│   ├── api.js                         # github服务端请求
│   ├── create.js                      # 创建入口文件
│   ├── Creator.js                     # 创建逻辑
│   └── util.js                        # 相关方法
├── README.md                          # 代码框架说明
└── package.json                       # 整体环境配置
```