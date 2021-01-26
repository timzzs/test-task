"use strict";

const {src, dest} = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require('gulp-strip-css-comments');
const rename = require("gulp-rename");
const less = require("gulp-less");
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify-es").default;
const plumber = require("gulp-plumber");
const panini = require("panini");
const imagemin = require("gulp-imagemin");
const fileinclude = require('gulp-file-include');
const del = require("del");
const notify = require("gulp-notify");
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const browserSync = require("browser-sync").create();


/* Paths */
const srcPath = 'src/';
const buildPath = 'build/';

const path = {
    build: {
        html: buildPath,
        js: buildPath + "assets/js/",
        css: buildPath + "assets/css/",
        images: buildPath + "assets/images/",
        fonts: buildPath + "assets/fonts/",
        plugin: buildPath + "assets/plugins/"
    },
    src: {
        html: srcPath + "*.html",
        js: srcPath + "assets/js/*.js",
        css: srcPath + "assets/less/*.less",
        images: srcPath + "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
        plugin: srcPath + "assets/plugins/**/*"
    },
    watch: {
        html: srcPath + "**/*.html",
        js: srcPath + "assets/js/**/*.js",
        css: srcPath + "assets/less/**/*.less",
        images: srcPath + "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
        plugin: srcPath + "assets/plugins/**/*"
    },
    clean: "./" + buildPath
}


/* Tasks */

function serve() {
    browserSync.init({
        server: {
            baseDir: "./" + buildPath
        },
        notify: false,
        online: true
    })
}

function html(cb) {
    panini.refresh();
    return src(path.src.html, {base: srcPath})
        .pipe(plumber())
        .pipe(panini({
            root: srcPath,
            layouts: srcPath + 'layouts/',
            partials: srcPath + 'partials/',
        }))
        .pipe(dest(path.build.html))
        .pipe(browserSync.reload({stream: true}));
    cb();
}

function css(cb) {
    return src(path.src.css, {base: srcPath + "assets/less/"})
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "LESS Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('style.css'))
        .pipe(less({
            includePaths: './node_modules/'
        }))
        .pipe(autoprefixer({
            cascade: true
        }))
        .pipe(cssbeautify())
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(removeComments())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(sourcemaps.write())
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({stream: true}));
    cb();
}

function js(cb) {
    return src(path.src.js)
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "JS Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({stream: true}));

    cb();
}

function images(cb) {
    return src(path.src.images)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 95, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest(path.build.images))
        .pipe(browserSync.reload({stream: true}));

}

function fonts(cb) {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts))
        .pipe(browserSync.reload({stream: true}));

    cb();
}

function plugin(cb) {
    return src(path.src.plugin)
        .pipe(dest(path.build.plugin));
    cb();
}

function clean(cb) {
    return del(path.clean);

    cb();
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.images], images);
    gulp.watch([path.watch.fonts], fonts);
    gulp.watch([path.watch.plugin], plugin);
}

const build = gulp.series(clean, gulp.parallel(html, plugin, css, js, images, fonts));
const watch = gulp.parallel(build, watchFiles, serve);


/* Exports Tasks */
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.plugin = plugin;
// exports.build = build;
exports.watchFiles = watchFiles;
exports.default = watch;
