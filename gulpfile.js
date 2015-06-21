var gulp = require('gulp'),
    karma = require('karma').server,
    license = require('gulp-license'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename");

gulp.task('default', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, done);
});

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('dist', [
        'test'
    ], function() {
        gulp.src('./src/*.js')
            .pipe(uglify())
            .pipe(rename({
                suffix: "-min"
            }))
            .pipe(license('MIT', {
                tiny: false,
                organization: 'Ryan Beard'
            }))
            .pipe(gulp.dest('./dist/'));

        gulp.src('./src/*.js')
            .pipe(license('MIT', {
                tiny: false,
                organization: 'Ryan Beard'
            }))
            .pipe(gulp.dest('./dist/'));
    });