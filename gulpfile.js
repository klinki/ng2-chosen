'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var typescript = require('typescript');
var glob = require('glob');

gulp.task('clean', function () {
    return gulp
        .src('./dist/**/*', {read: false})
        .pipe(clean());
})

function tsc(options) {

    glob('./src/**/*.ts', {}, function (err, files) {
        var program = typescript.createProgram(files, Object.assign(options, {
            target: typescript.ScriptTarget.ES5,
            sourceMap: true,
            removeComments: true,
            noImplicitAny: false,
            experimentalDecorators: true,
            emitDecoratorMetadata: true
        }));

        program.emit();
        //typescript.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    })
}

gulp.task('build.commonjs', function () {
    tsc({
        module: typescript.ModuleKind.CommonJS,
        declaration: true,
        outDir: "./dist"
    });
});

gulp.task('build.amd', function () {
    tsc({
        module: typescript.ModuleKind.AMD,
        declaration: false,
        outFile: "./dist/ng2-chosen.amd.js"
    });
});

gulp.task('build.system', function () {
    tsc({
        module: typescript.ModuleKind.System,
        declaration: false,
        outFile: "./dist/ng2-chosen.system.js"
    });
});

gulp.task('ts', ['build.system', 'build.commonjs']);

gulp.task('default', ['clean', 'ts']);

gulp.task('dev', ['default'], function () {

    gulp.watch('src/**/*.ts', ['ts']);

});