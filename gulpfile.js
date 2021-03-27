"use strict"
const { src, dest, watch, series, parallel } = require('gulp')
const prefixer     = require("gulp-autoprefixer")
const sass         = require("gulp-sass")
const fileinclude  = require("gulp-file-include")
const cssmin       = require("gulp-clean-css")
const babel        = require("gulp-babel")
const plumber      = require("gulp-plumber")
const notify       = require("gulp-notify")
const browsersync  = require("browser-sync")
const del          = require("del")
const changed      = require("gulp-changed")

let path = {
	src: {
		html: ["src/**/*.html", "!src/components/**"],
		allHtml: "src/**/*.html",
		js: "src/js/main.js",
		css: "src/scss/**/*",
		img: "src/images/**/*",
		fonts: "src/fonts/**",
		libs: "src/libs/**"
	},
	build: {
		html: "build/",
		js: "build/js/",
		css: "build/css/",
		img: "build/images/",
		fonts: "build/fonts/",
		libs: "build/libs/"
	}
}//path

function server(done) {
	browsersync.init({
		server: {
			baseDir: './build/'
		},
		host: 'localhost',
		port: 8900,
		open: false,
		notify: false,
	})
	done()
}

function serverReload(done) {
	browsersync.reload()
	done()
}

function buildHtml() {
	return src(path.src.html)
		.pipe(fileinclude({
			prefix: "@@",
			basepath: "@file",
			context: {
				name: 'test'
			}
		}))
		.pipe(plumber())
		.pipe(dest(path.build.html))
		.pipe(plumber.stop())
		.pipe(browsersync.stream())
		.pipe(notify({ message: 'Processed <%= file.relative %>' }))
}

function buildCss() {
	return src(path.src.css)
		.pipe(plumber())
		.pipe(sass().on("error", sass.logError))
		.pipe(prefixer())
		.pipe(cssmin())
		.pipe(plumber.stop())
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
		.pipe(notify({ message: 'Processed <%= file.relative %>' }))
}

function buildJs() {
	return src(path.src.js)
		.pipe(plumber())
		.pipe(fileinclude({
			prefix: "@@",
			basepath: "@file"
		}))
		.pipe(babel({
			presets: ["@babel/env"]
		}))
		// .pipe(plumber.stop())
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
		.pipe(notify({ message: 'Processed <%= file.relative %>' }))
}

//hangs?
function buildImg() {
	return src(path.src.img)
		.pipe(changed(path.build.img))
		.pipe(dest(path.build.img))
		.pipe(notify({ message: 'Processed <%= file.relative %>' }))
}

function buildFonts() {
	return src(path.src.fonts)
		.pipe(changed(path.build.fonts))
		.pipe(dest(path.build.fonts))
		.pipe(notify({ message: 'Processed <%= file.relative %>' }))
}

function buildLibs() {
	return src(path.src.libs)
		.pipe(changed(path.build.libs))
		.pipe(dest(path.build.libs))
		.pipe(notify({ message: 'Processed <%= file.relative %>' }))
}

function clear() {
	return del('./build/')
}

function watchAll() {
	watch(path.src.allHtml, buildHtml)
	watch(path.src.css, buildCss)
	watch(path.src.js, buildJs)
	watch(path.src.img, buildImg)
	watch(path.src.fonts, buildFonts)
}

const justStart = parallel(watchAll, server, serverReload)
const build = series(buildHtml, buildCss, buildJs, buildImg, buildFonts, buildLibs)
const clearAndBuild = series(clear, build)
const buildAndStart = series(buildHtml, buildCss, buildImg, buildJs, buildFonts, buildLibs, justStart)

exports.default = buildAndStart
exports.build = build
exports.clearAndBuild = clearAndBuild
