/* jshint esversion: 6 */
var gulp = require("gulp");
var watch = require("gulp-watch");
var less = require("gulp-less");
var typescript = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var minifyjs = require("gulp-uglify");
var minifycss = require("gulp-clean-css");

var tsProject = typescript.createProject("ts/tsconfig.json");

gulp.task("compile-ts", () =>
	tsProject.src()
		.pipe(sourcemaps.init())
		.pipe(tsProject())
		.js
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("dist/js")));

gulp.task("compile-less", () =>
	gulp.src("less/**/*.less")
		.pipe(less({ paths: ["less/site.less"] }))
		.pipe(gulp.dest("dist/css")));

gulp.task("minify-js", () =>
	gulp.src("dist/js/*.js")
		.pipe(sourcemaps.init())
		.pipe(minifyjs())
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("dist/js")));

gulp.task("minify-css", () =>
	gulp.src("dist/css/*.css")
		.pipe(sourcemaps.init())
		.pipe(minifycss())
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("dist/css")));

gulp.task("copy-html", () =>
	gulp.src("*.html")
		.pipe(gulp.dest("dist")));

gulp.task("copy-misc", () =>
	gulp.src(["CNAME", "robots.txt", "favicon.ico"])
		.pipe(gulp.dest("dist")));

gulp.task("copy-img", () =>
	gulp.src("img/*")
		.pipe(gulp.dest("dist/img")));

gulp.task("copy-snd", () =>
	gulp.src("snd/**")
		.pipe(gulp.dest("dist/snd")));

gulp.task("copy-txt", () =>
	gulp.src("txt/*")
		.pipe(gulp.dest("dist/txt")));

gulp.task("copy-js", () =>
	gulp.src("js/*")
		.pipe(gulp.dest("dist/js")));

gulp.task("copy-all", ["copy-html", "copy-misc", "copy-img", "copy-snd", "copy-txt", "copy-js"]);

gulp.task("build", ["compile-ts", "compile-less", "copy-all"]);

gulp.task("minify", ["minify-js", "minify-css"]);

gulp.task("default", ["build"], () => {
	gulp.watch("ts/**/*.ts", ["compile-ts"]);
	gulp.watch("less/**/*.less", ["compile-less"]);
	gulp.watch("img/**/*", ["copy-img"]);
	gulp.watch("*.html", ["copy-html"]);
});
