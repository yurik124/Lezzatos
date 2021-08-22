const { src, dest, series, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const webp = require('gulp-webp')
const del = require('del')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sync = require('browser-sync').create()

// npm i --save-dev del browser-sync gulp-concat gulp-csso gulp-file-include gulp-htmlmin gulp-autoprefixer gulp

function htmlProd() {
  return src('src/**.html')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('dist'))
}

function htmlDev() {
  return src('src/**.html')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(dest('dist'))
}

function styleProd() {
  return src('src/scss/**/index.sass')
    .pipe(sass())
    .pipe(autoprefixer({
      grid: true
    }))
    .pipe(csso())
    .pipe(dest('dist'))
}

function styleDev() {
  return src('src/scss/**/index.sass')
    .pipe(sass())
    .pipe(dest('dist'))
}

function clear() {
  return del('dist')
}

function img() {
  return src('src/img/**/*[.jpg, .png]')
    .pipe(dest('dist/img'))
}

function imgWebp() {
  return src('src/img/**/*[.jpg, .png]')
    .pipe(webp())
    .pipe(dest('dist/img'))
}

function serve() {
  sync.init({
    server: './dist'
  })

  watch('src/parts/**.html', series(htmlDev)).on('change', sync.reload)
  watch('src/**/**.html', series(htmlDev)).on('change', sync.reload)
  watch('src/scss/**.sass', series(styleDev)).on('change', sync.reload)
  watch('src/scss/blocks/**.sass', series(styleDev)).on('change', sync.reload)
  watch('src/img/**/*[.jpg, .png]', series(img)).on('change', sync.reload)
  watch('src/img/**/*.webp', series(imgWebp)).on('change', sync.reload)
}

exports.build = series(clear, styleProd, htmlProd, img, imgWebp)
exports.serve = series(clear, styleDev, htmlDev, img, imgWebp, serve)
exports.clear = clear