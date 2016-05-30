## 基础
看这份教程，默认你学过 Gulp 和 Webpack. 如果没有学过，可以稍微学一下，并能自己成功打包个demo. 然后，再继续看下面的内容。

## 选择Gulp + Webpack
Webpack 是必选的，因为项目中文件的依赖关系是它处理的。它本身就是一个很好的打包工具。那么，为什么还要把 Gulp 也用上呢？因为 Gulp 可以很灵活地组织打包流程，而且对于文件的复制、删除、合并等操作，它也很擅长。这些是 Webpack 目前还没做到的。或者说， Webpack 提供的是标准化的文件依赖打包流程。两者的出发点不一样。那么 MYUI 的打包工具，是怎么一步步搭起来的呢？来，每一步的组成，我都会细细说明，有好的想法，也欢迎跟我们联系。我们一起努力做得更好。

首先，我们是用 Gulp 作为打包的骨架。而 Webpack 是用 `gulp-webpack` 作为 Gulp 的一个插件来工作的。

## 搭 Gulp 骨架
下面，我们开始讲解，整个打包工具的骨架。
### 让 Gulp 支持在 Es6 下工作
1. 把根目录的 `gulpfile.js` 重命名为 `gulpfile.babel.js`
2. `npm i babel-core babel-preset-es2015 -D` 引入 `babel-core` 和 `babel-preset-es2015` 这两个npm包（这里说明下，i 是 install 的简写， -D 是 --save-dev 的简写）
3. 在 `package.json` 加入对 Es2015 的支持：

	```js
	"babel": {
        "presets": [
            "es2015"
        ]
    }
	```

### 打包任务，分文件处理
一个打包工具，需要处理很多的打包任务，肯定不能把所有的工作，都放在 `gulpfile.babel.js` 这一个文件里面。所以，我们把 `gulpfile.babel.js` 作为总调度，其它具体任务放在具体的指定文件。这里，在项目根目录创建一个 `package/core` 来放这些具体执行打包任务文件。比如，`pack/core/base.js` 用来打包项目的 vendor 公用基础包。 具体做法：

1. 安装 `npm i require-dir -D` 它能搜寻指定目录下的js文件，把里面的 `gulp.task('xxx')` 任务都找到。
2. 对于具体执行任务的 `package/core` 目录下的文件，比如，我们定义它的task名是core.base. 于是，`package/core/base.js`里面的入口是这样的：
	```js
	gulp.task('core.task', ()=>{});
	```

3. 在总调度 `gulpfile.bebel.js` 中：
	```js
	const gulp = require('gulp'),
 		requireDir = require('require-dir');
 	requireDir('./package/core', {recurse: false}); // 不递归往文件夹里继续找
	gulp.task('base', ['core.base']);
	```

这样，当我们在命令行敲入 `gulp base` 时，实际是执行了 `package/core/base.js` 下的任务。达到了任务分文件的目的。

### 串行执行任务
gulp 中，它执行任务都是并行的。但是，有时候，我们的任务确实需要串行执行。 这个时候，你需要一个npm包 `gulp-sequence`. 好了，我们刚才说，`package/core/base.js` 是用来打包项目公用文件的，那么一般都会有分js和css两个文件，比如：`vendor.js` 和 `vendor.css`。 此时，我们一般会把这两个任务分开处理。这里假设，打包js的任务必须先执行，那么具体怎么做呢？
1. 首先，安装npm包 `npm i gulp-sequence -D`
2. `package/core/base.js` 中：

	```javascript
	const gulp = require('gulp'),
		Sequence = require('gulp-sequence');
	gulp.task('core.base:js', (cb) => {});
	gulp.task('core.base:css', (cb) => {});
	gulp.task('core.base', (cb) => {
		Sequence('core.base:js', 'core.base:css', cb);
	});
	```

至此，整个项目的打包骨架，搭起来了。对于 `gulp-webpack` 这个npm包的使用，这里就没有谈了。可以直接看官方的教程。

## 对我很有用的 npm 包
### 读取命令参数
我们再拿 `package/core/base.js` 来说，我们打包这个公共基础。有时候，我们希望打包出来的是压缩版；有时候，为了调试，我们有希望打包出来的是未压缩版的。而且，我们希望，对于基础包的处理，都通过 `gulp base` 这条命令来处理，那么，我们就需要引入参数。比如，默认情况下，我们打包的压缩版，如果输入的是 `gulp base --dev`，那么就打一个未压缩版的。 那么就需要这个npm包：

1. `npm i yargs -D`

### 更换html中的链接地址
这个需求，很常见，当我们开发的项目要上线时。我们一般会把里面的静态资源 img, js, css 替换成线上地址。那么：

1. `npm i gulp-prefix -D`

### 让html中，指定的 js, css 文件内嵌
这个需求，一般也来自项目要上线。为了减少 http 请求，我们会把小的 css 和 js 内嵌在 html 里面。那么：
1. `npm i gulp-htmlone -D`

### 所见即所得 —— 浏览器实时刷新
对于 react.js 来讲，有很好的一套 hmd 机制，能够实现局部实时更新。当然，它只能在当你改动 react 对应的模块时，才能生效。如果我们修改 html 文件，就不能实时刷新了。所以，为了让浏览器根据我们指定文件修改后，进行刷新，我们采用了 `browser-sync` 这个 npm 包。 它有两种模式：指定服务器根目录和指定代理。当你本地开发，还没跟接口联调的时候，你可以使用“指定服务器根目录”来工作。当你，进入了跟接口联调的时候，就可以开启“指定代理”模式来工作，这样才能取到它们的数据。这里，我把核心配置分享下：

1. 首先，安装npm包 `npm i browser-sync -D`
2. 你具体的打包文件中：

	```javascript
	const gulp = require('gulp'),
	    browserSync = require('browser-sync').create();

	// Static Server + watching
	gulp.task('core.dev:hot', () => {
		var serveCfg = {};
		if (useProxy) { // useProxy 的条件你自己写
			serveCfg.proxy = config.vhost; // 使用代理
		} else {
			serveCfg.server = './'; // 使用本地目录
		}
	    browserSync.init(serveCfg);

	    gulp.watch([SRC.views + '/*.*', DIST.path + '/**/*']).on('change', browserSync.reload); // 前面监听的文件，根据你项目的需要自己写：）
	});
	```

## 总结
这份打包工具，核心的干货就在这里啦。希望对你有帮助，让前端自动化帮你在开发中，提高效率。
