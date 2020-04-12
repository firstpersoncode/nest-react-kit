/* eslint-disable */
const gulp = require('gulp')
const browserify = require('browserify')
const watchify = require('watchify')
const babelify = require('babelify')
const sourcemaps = require('gulp-sourcemaps')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const uglify = require('gulp-uglify')
const fancy_log = require('fancy-log')

const b = browserify({
    basedir: '.',
    entries: ['view/index.jsx'],
    debug: true,
    cache: {},
    packageCache: {},
    extensions: ['.js', '.jsx']
})
    .plugin(watchify)
    .transform(babelify, {
        plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-transform-react-jsx'],
        presets: ['@babel/preset-env', '@babel/preset-react']
    })

b.on('update', bundle)
b.on('log', fancy_log)

gulp.task('default', bundle)

function bundle() {
    return b
        .bundle()
        .on('error', fancy_log)
        .pipe(source('main.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('public/assets/js'))
}
