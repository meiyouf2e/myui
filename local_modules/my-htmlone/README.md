# gulp-htmlone

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
![cise](http://cise.alibaba-inc.com/task/69703/status.svg)

[npm-image]: https://img.shields.io/npm/v/gulp-htmlone.svg?style=flat-square
[npm-url]: https://npmjs.org/package/gulp-htmlone
[downloads-image]: http://img.shields.io/npm/dm/gulp-htmlone.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/gulp-htmlone

combo and minify `css` and `js` to html. no matter the file is online or not.

[One-Request](http://gitlab.alibaba-inc.com/groups/one-request)集成解决方案之一，厂内同学请移步[Group:One-Request](http://gitlab.alibaba-inc.com/groups/one-request)

## Features

+ css, js自动内联
+ 支持http资源自动下载后再内联
+ 内联后资源引用相对路径修正，包括线上资源down下来后内部相对路径资源自动替换为绝对路径
+ css，js 选择性压缩
+ 支持 配置不需要combine内联的资源，selector配置
+ 支持冗余和开发时tag自动移除
+ 支持 @import 的解析和combine, 包括 @import 线上和本地引用共存
+ script 标签上属性的保留

## Usage

```javascript
var gulp = require('gulp');
var htmlone = require('gulp-htmlone');

gulp.task('htmlone', function() {
    gulp.src(['./*.html'])
        .pipe(htmlone())
        .pipe(gulp.dest('./dest'));
});
```
then gulp will combo the content of `<script >` and `<link rel="stylesheet" />` tags to the dest html doc.

## Options
```javascript
gulp.src('./src/*.html')
    .pipe(htmlone({
    	removeSelector: '[will-remove]', // selector 配置，源文档中符合这个selector的标签将自动移除
        keepliveSelector: '[keeplive]',  // 不要combo的selector配置，源文档中符合这个selector的将保持原状。如果是相对路径，则会根据配置修改成线上可访问地址
        destDir: './',  // dest 目录配置，一般情况下需要和 gulp.dest 目录保持一致，用于修正相对路径资源
        coimport: true,  // 是否需要把 @import 的资源合并
        cssminify: true, // 是否需要压缩css
        jsminify: true,  // 是否需要压缩js
        publish: false, // 是否是发布到线上的文件，false为发布到日常，预发理论上和日常的文件内容一样
        appName: 'app-xxx', //仓库名
        appVersion: '0.0.0', //发布版本号
        noAlicdn: false, // js相对路径拼接的域名是否是alicdn的
        onlinePath: '', //非alicdn线上域名
        dailyPath: '', //非alicdn日常域名
    }))
    // ...
```

## License
MIT

## Changelog

- 0.0.3 修复windows 下 `mkdirp` 的问题
- 0.0.4 加上`removeSelector` 配置
- 0.1.0 大版本升级，以下变更
  + 由之前的需要加上指定属性才combo的方式 变更为 **默认都执行，只有加上指定标识的才不执行combo**，详见 `Usage`
  + api 变更，去掉`keyattr`配置，改为 `keepliveSelector` ,标识指定`selector`不执行combo操作
  + 新增 `destDir` 配置，用于当destFile和sourceFile不在一级目录的时候，css等资源内联后内部url相对路径资源修正
  + 新增 `coimport` 配置，用于选择是否需要将css 中 `@import` 进行combile后再内联至html文档。支持@import 递归 和 http url 的import 以及路径修正
  + 中间临时文件处理目录由 `temp` 变为 `htmlone_temp` ，temp目录太通用，容易冲突
- 0.1.1 css的压缩不用less处理，改为`ycssmin`, 避免windows环境下dataurl less处理的路径bug。
- 0.1.2 修复 dataurl 当作相对路径处理的bug
- 0.1.3 修复全站https化后 `//aaa.com` 的处理问题
- 0.1.4 修复 css 的keeplive 无效的问题 [issue](http://gitlab.alibaba-inc.com/one-request/or-htmlone-gulp/issues/10)
- 0.1.5 修复 0.1.3 & 0.1.4 版本的data img 判断问题
- 0.1.6 修复 uglifyjs 默认吧 `\x3c/script>` 解成 `</script>`导致内联script脚本非预期截断的问题
- 0.1.7 见 [MergeRequest](http://gitlab.alibaba-inc.com/one-request/or-htmlone-gulp/merge_requests/2) by @青缨
- 0.1.8 fix node@v3.0.x + 的文件流steam io异步导致的 文件还没写入完成就开始清理工作导致的bug。
- 0.1.9 临时文件清理时机改为进程退出时清理，避免一些异步状态引起的提前清理的bug
