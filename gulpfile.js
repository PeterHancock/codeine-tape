var gulp = require('gulp'),
    path = require('path'),
    rimraf = require('rimraf'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat'),
    merge = require('merge-stream'),
    path = require('path'),
    reactify = require('reactify');

var staticDir = 'static';

gulp.task('clean', function (done) {
    rimraf(staticDir, done);
});

gulp.task('build', ['clean'], function () {
    function browserifyTape() {
        return browserify({ entries: 'browser/browser-tape.js', transform: [reactify] })
          .require('tape')
          .bundle()
          .pipe(source('browser-tape-bundle.js'))
          .pipe(gulp.dest(path.join(staticDir, 'js')));
    }
    return merge(
        buildStatics()
        , browserifyTape()
    );
});

gulp.task('default', ['build']);

function buildStatics() {
    var js = gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/materialize/dist/js/materialize.min.js',
        'bower_components/prism/prism.js'
    ])
        .pipe(concat('all.js'))
        .pipe(gulp.dest(path.join(staticDir, 'js')));

    var css = gulp.src([
        'css/*.css',
        'bower_components/materialize/dist/css/materialize.min.css'
    ])
        .pipe(concat('all.css'))
        .pipe(gulp.dest(path.join(staticDir, 'css')));

    var fonts = gulp.src([
            'bower_components/materialize/dist/font/**'
        ])
        .pipe(gulp.dest(path.join(staticDir, 'font')));


    var browserTapeCss = gulp.src('browser/browser-tape.css')
            .pipe(gulp.dest(path.join(staticDir, 'css')))

    return merge([js, css, browserTapeCss, fonts]);
}
