import gulp from 'gulp'
import browserSyncFactory from 'browser-sync'
import { rollup } from 'rollup'
import babel from 'rollup-plugin-babel'
import strip from 'rollup-plugin-strip'
import resolve from 'rollup-plugin-node-resolve'

const production = false

const browserSync = browserSyncFactory.create()

gulp.task('html', () => gulp.src('./src/index.html').pipe(gulp.dest('./dist')));

gulp.task('watch:html', gulp.series('html', (done) => {
  browserSync.reload()
  done()
}))

gulp.task('js', async function (done) {

  const bundle = await rollup({
    input: './src/js/main.js',
    plugins: [
      babel({
        presets: [
          ["env", {
            modules: false
          }]
        ],
        babelrc: false
      }),
      resolve(),
      production && strip()
    ]
  });

  await bundle.write({
    file: './dist/js/bundle.js',
    format: 'iife',
    name: 'bundle',
    sourcemap: true
  })

  done();

})

gulp.task('watch:js', gulp.series('js', (done) => {
  browserSync.reload()
  done()
}))

gulp.task('serve', () => {

  browserSync.init({
    server: {
      baseDir: './dist/'
    },
    logLevel: 'info',
    open: false
  })

  gulp.watch('./src/js/**/*.js', gulp.series('watch:js'))
  gulp.watch('./src/*.html', gulp.series('watch:html'))

})

gulp.task('default', gulp.series('html', 'js', 'serve'))
