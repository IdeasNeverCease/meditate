"use strict";



const browserify = require("browserify");
const buffer = require("vinyl-buffer");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const header = require("gulp-header");
const rename = require("gulp-rename");
const source = require("vinyl-source-stream");
const terser = require("gulp-terser");

const pkg = require("./package.json");

const banner = [
  "/**",
  " * <%= pkg.name %> v<%= pkg.version %>",
  " * Copyright <%= pkg.author %>",
  " * @link <%= pkg.repository.url %>",
  " * @license <%= pkg.license %>",
  " */",
  ""
].join("\n");

function lint() {
  return gulp.src("./src/js/**/*.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function scripts() {
  return browserify({ entries: "./src/js/meditate.js", standalone: "Meditate" }).bundle()
    .pipe(source("meditate.min.js"))
    .pipe(buffer())
    .pipe(terser({
      mangle: {
        toplevel: true
      }
    }))
    // .pipe(uglify()) // breaks due to `const`
    .pipe(header(banner, { pkg }))
    .pipe(gulp.dest("./dist/"));
}

function styles() {
  const cssFiles = [
    "./node_modules/codemirror/lib/codemirror.css",
    "./src/css/*.css",
    "./node_modules/codemirror-spell-checker/src/css/spell-checker.css"
  ];

  return gulp.src(cssFiles)
    .pipe(concat("meditate.css"))
    .pipe(cleanCSS())
    .pipe(rename("meditate.min.css"))
    .pipe(buffer())
    .pipe(header(banner, { pkg }))
    .pipe(gulp.dest("./dist/"));
}

const build = gulp.parallel(gulp.series(lint, scripts), styles);

gulp.task("default", build);
