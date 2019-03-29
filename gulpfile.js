"use strict";



//  P A C K A G E S

const browserify = require("browserify");
const buffer = require("vinyl-buffer");
const concat = require("gulp-concat");
const debug = require("gulp-debug");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const header = require("gulp-header");
const minifycss = require("gulp-clean-css");
const prettify = require("gulp-jsbeautifier");
const rename = require("gulp-rename");
const source = require("vinyl-source-stream");
const uglify = require("gulp-uglify");

//  U T I L S

const pkg = require("./package.json");

const banner = [
  "/**",
  " * <%= pkg.name %> v<%= pkg.version %>",
  " * Copyright <%= pkg.company %>",
  " * @link <%= pkg.homepage %>",
  " * @license <%= pkg.license %>",
  " */",
  ""
].join("\n");



//  P R O G R A M

gulp.task("prettify-js", [], () => {
  return gulp.src("./src/js/meditate.js")
    .pipe(prettify({
      js: {
        brace_style: "collapse",
        indent_char: "\t",
        indent_size: 1,
        max_preserve_newlines: 3,
        space_before_conditional: false
      }
    }))
    .pipe(gulp.dest("./src/js"));
});

gulp.task("prettify-css", [], () => {
  return gulp.src("./src/css/meditate.css")
    .pipe(prettify({
      css: {
        indentChar: "\t",
        indentSize: 1
      }
    }))
    .pipe(gulp.dest("./src/css"));
});

gulp.task("lint", ["prettify-js"], () => {
  gulp.src("./src/js/**/*.js")
    .pipe(debug())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

function taskBrowserify(opts) {
  return browserify("./src/js/meditate.js", opts).bundle();
}

gulp.task("browserify:debug", ["lint"], () => {
  return taskBrowserify({
    debug: true,
    standalone: "Meditate"
  })
    .pipe(source("meditate.debug.js"))
    .pipe(buffer())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest("./debug/"));
});

gulp.task("browserify", ["lint"], () => {
  return taskBrowserify({ standalone: "Meditate" })
    .pipe(source("meditate.js"))
    .pipe(buffer())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest("./debug/"));
});

gulp.task("scripts", ["browserify:debug", "browserify", "lint"], () => {
  const js_files = ["./debug/meditate.js"];

  return gulp.src(js_files)
    .pipe(concat("meditate.min.js"))
    .pipe(uglify())
    .pipe(buffer())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("styles", ["prettify-css"], () => {
  const css_files = [
    "./node_modules/codemirror/lib/codemirror.css",
    "./src/css/*.css",
    "./node_modules/codemirror-spell-checker/src/css/spell-checker.css"
  ];

  return gulp.src(css_files)
    .pipe(concat("meditate.css"))
    .pipe(buffer())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest("./debug/"))
    .pipe(minifycss())
    .pipe(rename("meditate.min.css"))
    .pipe(buffer())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("default", ["scripts", "styles"]);
