// 分割代入、下記定数を作成ファイル内で使えるようにする。
const { src, dest, watch, series, parallel } = require('gulp');

// gulp-load-pluginsを使ってプラグインの読み込みを簡素化
// gulp-load-pluginsを$に代入、$.[プラグイン名]で読み込みが可能になる。
// ※「gulp-*」で始まるプラグインを読み込むため、別パターンにも対応させる必要がある。
const $ = require('gulp-load-plugins')({
  pattern:["gulp-*", "gulp.*", "browser-sync", "autoprefixer"]
});

const fs = require("fs");//追加
const pkg = require('./package.json');
const config = pkg["gulp-config"];
// const ejs = require("gulp-ejs");
const json_path = "./src/data/site.json";
const json = JSON.parse(fs.readFileSync(json_path));
const sizes = config.sizes;
const sass = require('gulp-sass')(require('sass'));
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const cleancss = require("gulp-clean-css");
const browserSync = require("browser-sync");
const server = browserSync.create();
const isProd = process.env.NODE_ENV === "production";

function icon(done) {
  for (let size of sizes) {
    let width = size[0];
    let height = size[1];
    src('./src/assets/images/icon/favicon.png')
      .pipe($.imageResize({
        width,
        height,
        crop: true,
        upscale: false
      }))
      .pipe(imagemin())
      .pipe($.rename(`favicon-${width}x${height}.png`))
      .pipe(dest('./dist/assets/images/icon'));
  }
  done();
}


// imageminで画像の圧縮、changedで画像の再圧縮の無効化
function images() {
  return src('./src/assets/images/**')
    .pipe($.changed('./dist/assets/images/'))
    .pipe(imagemin([
      pngquant({
        quality: [0.6, 0.7],
        speed: 1
      }),
      mozjpeg({
        quality: 65
      }),
      imagemin.svgo(),
      imagemin.optipng(),
      imagemin.gifsicle({
        optimizationLevel: 3
      })
    ]))
    .pipe(dest('./dist/assets/images/'));
}

//
function ejses() {
  return src(['./src/ejs/**/*.ejs', '!' + './src/ejs/**/_*.ejs'])
  .pipe(
    $.ejs({
      jsonData: json,
    })
  )
  .pipe($.rename({ extname: '.html'}))
  .pipe(dest('./dist/'));
}

function styles() {
  return src('./src/assets/styles/style.scss')
    .pipe($.if(!isProd, $.sourcemaps.init()))
    // .pipe($.plumber())
    .pipe(sass())
    .pipe($.postcss([
      $.autoprefixer({
        overrideBrowserslist: ["last 2 versions", "ie >= 10", "Android >= 5"],
        cascade: false
      })
    ]))
    .pipe($.if(!isProd, $.sourcemaps.write('.')))
    .pipe(dest('./dist/assets/styles/'));
}

function minify() {
  return src('./dist/assets/styles/style.css')
  // .pipe($.plumber())
  .pipe(cleancss())
  .pipe($.rename({ extname: '.min.css'}))
  .pipe(dest('./dist/assets/styles/'));
}

function scripts() {
  return src('./src/assets/scripts/*.js')
    .pipe($.if(!isProd, $.sourcemaps.init()))
    .pipe($.babel())
    .pipe($.if(!isProd, $.sourcemaps.write('.')))
    .pipe(dest('./dist/assets/scripts/'));
}

function startAppServer() {
  server.init({
    // port : 80,
    // proxy : "develop.wp/",
    // notify: false,
    // open: "external",
    server: {
      baseDir: './dist'
    }
  });

  watch('./src/assets/**/*.scss', styles);
  watch('./src/assets/**/*.js', scripts);
  watch('./src/assets/images/**', images);
  watch('./src/ejs/**/*.ejs', ejses);

  watch('./src/assets/**/*.scss').on('change', server.reload);
  watch('./src/assets/**/*.js').on('change', server.reload);
  watch('./src/assets/images/**').on('change', server.reload);
  watch('./src/ejs/**/*.ejs').on('change', server.reload);
  watch("./src/*.php").on('change', server.reload);
}

const serve = series(parallel(styles, images, ejses, series(scripts)), startAppServer);

exports.icon = icon;
exports.images = images;
exports.ejses = ejses;
exports.styles = styles;
exports.minify = minify;
exports.scripts = scripts;
exports.serve = serve;
