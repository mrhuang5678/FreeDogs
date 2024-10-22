# 项目使用说明

FreeDogs批量脚本

```
本程序由 MrHuang 编写
可通过邮箱: mrhuang5678@gmail.com 联系
可通过telegram: @MrHuang00 联系

```
telegram游戏链接:

```
https://t.me/theFreeDogs_bot/app?startapp=ref_6I7BsQKq

```
## 1. 安装依赖

在项目需要安装nodejs环境。

在项目根目录下运行以下命令来安装所需的依赖包：

```
npm install
```


## 2. 准备数据目录

在项目根目录下创建一个名为`data`的目录，并在其中创建`1.jaon`文件。该文件中应包含。

- `1.jaon`文件内容应以`一个id一个hash`。
- 注意： 添加多账号请看下面格式。

## 3. 项目修改

代码里面第300行开始到372行把注释去掉开启即为任务。默认不开启任务通过。

## 4. 运行项目

默认开启5线程，可以通过修改:

```
const maxConcurrentThreads = 5; // 线程数

```

在项目根目录下运行以下命令来启动项目：

```
node 1.js
```


## 5. 添加多号, 一行一个。

`1.json`文件项目：

```
{
  "data": [
    {
      "id": 1,
      "hash": "query_id%3D"
    },
    {
      "id": 2,
      "hash": "query_id%3D"
    }
  ]
}
```