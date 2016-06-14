var gulp = require('gulp'),
    watch = require('gulp-watch'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-minify-css'),
    browserSync = require("browser-sync"),
    gutil = require('gulp-util'),
    uncss = require('gulp-uncss'),
    inject = require('gulp-inject'), // include libraries css and js
    mainBowerGulp = require('gulp-main-bower-files'),
    stylus = require('gulp-stylus'),
    es = require('event-stream'),
    plumber = require('gulp-plumber'), // Show when error stoped process
    notify = require('gulp-notify'), //Using with plumber for showing error
    jsonServer = require('gulp-json-srv'),
    reload = browserSync.reload;

//------------- path describe

var path;
path = {
    production: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'production/',
        js: 'production/js/',
        css: 'production/css/',
        allcss: 'production/',
        img: 'production/img/',
        libs: 'production/libs/',
        fonts: 'production/fonts/',
        php: 'production/',
        bowerCss: 'production/bower_components/*.css',
        bowerJs: 'production/bower_components/*.js'
    },
    create: { //Пути откуда брать исходники
        html: 'create/**/*.html',
        js: 'create//js/**/*.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'create/sass/main.sass',
        allcss: 'create/**/*.css',
        img: 'create/img/*.*',
        libs: 'create/libs/**/*.*',
        fonts: 'create/fonts/**/*.*',
        php: 'create/mail.php',
        root: 'create',
        bowerCss: 'create/bower_components/*.css',
        bowerJs: 'create/bower_components/*.js'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'create/**/*.html',
        js: 'create/js/**/*.js',
        allcss: 'create/**/*.css',
        style: 'create/sass/**/*.sass',
        img: 'create/img/**/*.*',
        fonts: 'create/fonts/**/*.*',
        php: 'create/mail.php',
        libs: 'create/libs/**/*.*'
    },
    clean: './production'
};

//------------- server config

var config = {
    server: {
        baseDir: "./production"
    },
    //tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "EvilTool"
};
//-------------
// Error function

var reportError = function (error) {
    var lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';

    notify({
        title: 'Task Failed [' + error.plugin + ']',
        message: lineNumber + 'See console.',
        sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
    }).write(error);

    gutil.beep(); // Beep 'sosumi' again
    var report = '';
    var chalk = gutil.colors.white.bgRed;

    report += chalk('TASK:') + ' [' + error.plugin + ']\n';
    report += chalk('PROB:') + ' ' + error.message + '\n';
    if (error.lineNumber) {
        report += chalk('LINE:') + ' ' + error.lineNumber + '\n';
    }
    if (error.fileName) {
        report += chalk('FILE:') + ' ' + error.fileName + '\n';
    }
    console.error(report);

    // Prevent the 'watch' task from stopping
    this.emit('end');
};

//************* project build *************

gulp.task('bower:build', function () {
    return gulp.src('./bower.json')
        .pipe(mainBowerGulp({
            overrides: {
                "jquery": {
                    main: 'dist/*.min.js'
                },
                "bootstrap": {
                    main: [
                        './dist/js/*.min.js',
                        './dist/css/*.min.css',
                        './dist/fonts/*.*'
                    ]
                },
                "angular": {
                    main: './*.min.js'
                },
                "angular-ui-router": {
                    main: './**/*.min.js'
                },
                "ngstorage": {
                    main: './**/*.min.js'
                },
                "angular-ui-router.stateHelper": {
                    main: './*.min.js'
                }
            }
        }))
        .pipe(gulp.dest('./create/libs/bower-libs/'));
});


// add libraries

gulp.task('index:build', function () {

    var injectFunk = function (path, name) {
        return (inject(gulp.src([path], {read: false}),
            //Options
            {
                addRootSlash: false,
                ignorePath: 'create',
                name: name
            }
        ));
    };

    //modded usage

    gulp.src('./create/index.html')
        .pipe(injectFunk(path.create.allcss))
        .pipe(injectFunk('create/libs/bower-libs/**/*.js', 'bower'))
        .pipe(injectFunk('create/libs/js/**/*.js', 'add-libs'))
        .pipe(injectFunk('create/js/*.js', 'modules'))
        .pipe(injectFunk('create/js/controllers/*.js', 'controllers'))
        .pipe(injectFunk('create/js/services/*.js', 'services'))
        .pipe(injectFunk('create/js/directives/*.js', 'directives'))
        .pipe(gulp.dest('./create'));

});

// html

gulp.task('html:build', function () {
    gulp.src(path.create.html) //Выберем файлы по нужному пути       
        .pipe(gulp.dest(path.production.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

// SASS task

gulp.task('style:build', function () {
    gulp.src(path.create.style) //Выберем наш main.scss
        .pipe(plumber({
            errorHandler: reportError
        }))
        .pipe(sass()) //Скомпилируем
        //.pipe(uncss({html: ['production/index.html']}))
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(gulp.dest(path.production.css)) //И в build 
        .pipe(reload({stream: true}))
        .on('error', reportError);
});

// js task

gulp.task('js:build', function () {
    gulp.src(path.create.js) //Найдем наш main файл
        .pipe(plumber({
            errorHandler: reportError
        }))
        //.pipe(uglify().on('error', gutil.log)) - minify JS files
        .pipe(gulp.dest(path.production.js)) //Выплюнем готовый файл в production 
        .pipe(reload({stream: true}))
        .on('error', reportError);
});

// image task

gulp.task('image:build', function () {
    gulp.src(path.create.img) //Выберем наши картинки
        .pipe(plumber({
            errorHandler: reportError
        }))
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.production.img)) //И бросим в production
        .on('error', reportError);
});

// libs task

gulp.task('libs:build', function () {
    gulp.src(path.create.libs) //Выберем наши библиотеки        
        .pipe(gulp.dest(path.production.libs)); //И бросим в production
});

// fonts

gulp.task('fonts:build', function () {
    gulp.src(path.create.fonts) //Выберем наши шрифты        
        .pipe(gulp.dest(path.production.fonts)); //И бросим в production
});

// allcss minified

gulp.task('allcss:build', function () {
    gulp.src(path.create.allcss) //Выберем все файлы css
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        //.pipe(uncss({html: ['production/index.html']}))
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(gulp.dest(path.production.allcss)) //И в production
        .pipe(reload({stream: true}));
});

gulp.task('build', [
    'bower:build',
    'index:build',
    'html:build',
    'style:build',
    //'image:build',
    'js:build',
    'fonts:build',
    'libs:build',
    'allcss:build'
]);

//------------- webserver

gulp.task('webserver', function () {
    browserSync(config);
});

//------------- JSON server

gulp.task('json', function () { //https://www.npmjs.com/package/gulp-json-srv
    jsonServer.start(); // start serving 'db.json' on port 3000
});
//------------- watch config

gulp.task('watch', function () {
    watch([path.watch.libs], function () {
        gulp.start('index:build');
        //gulp.start('libs:build');
    });
    watch([path.watch.html], function () {
        gulp.start('html:build');
    });
    watch([path.watch.style], function () {
        gulp.start('style:build');
    });
    watch([path.watch.js], function () {
        gulp.start('js:build');
    });
    watch([path.watch.img], function () {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function () {
        gulp.start('fonts:build');
    });
    watch([path.watch.allcss], function () {
        gulp.start('allcss:build');
    });
});

gulp.task('default', ['build', 'webserver', 'json', 'watch']);

//gulp uncss
gulp.task('uncss', function () {
    return gulp.src('production/css/*.css') //путь к файлу в котором будут вносится изменения

        .pipe(uncss({html: ['production/index.html']}))
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(gulp.dest(path.production.allcss))
        .pipe(gulp.dest('production/uncssed/')); // куда складывать
});