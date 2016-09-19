var gulp = require("gulp");
var gutil = require("gulp-util");
var notify = require("gulp-notify");
var less = require("gulp-less");
var minifyCSS = require("gulp-minify-css")

gulp.task("css", function () {
    return gulp.src("less/*.less")
        .pipe(less({ style: "compressed" }).on("error", gutil.log))
        .pipe(gulp.dest("css"))
        .pipe(notify("CSS minified"))
});

gulp.task("watch", function () {
    gulp.watch("less/*.less", ["css"]);
});

gulp.task("default", ["css", "watch"]);
