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
    mainBowerFiles = require('main-bower-files'),
    mainBowerGulp = require('gulp-main-bower-files'),
    stylus = require('gulp-stylus'),
    es = require('event-stream'),
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


//************* project build *************
// Bower libraries create

//basic usage
//gulp.task('bower:build', function() {
//    return gulp.src(mainBowerGulp())
//        .pipe(gulp.dest('create/check/'));
//});

gulp.task('bower:build', function() {
    return gulp.src('./bower.json')
        .pipe(mainBowerGulp({
            overrides: {
                "jquery":{
                    main: 'dist/*.min.js'
                },
                "bootstrap": {
                    main: [
                        './dist/js/*.min.js',
                        './dist/css/*.min.css',
                        './dist/fonts/*.*'
                    ]
                },
                "angular":{
                    main: './*.min.js'
                },
                "angular-ui-router":{
                    main: './**/*.min.js'
                },
                "ngstorage":{
                    main: './**/*.min.js'
                },
                "angular-ui-router.stateHelper":{
                    main: './*.min.js'
                }
            }
        }))
        .pipe(gulp.dest('./create/libs/bower-libs/'));
});


// add libraries

gulp.task('index:build', function () {

    var injectFunk = function(path, name){
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
        .pipe(sass()) //Скомпилируем
        //.pipe(uncss({html: ['production/index.html']}))
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(gulp.dest(path.production.css)) //И в build 
        .pipe(reload({stream: true}));     
});

// js task

gulp.task('js:build', function () {
    gulp.src(path.create.js) //Найдем наш main файл        
        //.pipe(uglify().on('error', gutil.log)) - minify JS files
        .pipe(gulp.dest(path.production.js)) //Выплюнем готовый файл в production 
        .pipe(reload({stream: true}));     
});

// image task

gulp.task('image:build', function () {
    gulp.src(path.create.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.production.img)); //И бросим в production
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

//------------- watch config

gulp.task('watch', function(){  
    watch([path.watch.libs], function() {
        gulp.start('index:build');
        //gulp.start('libs:build');
    });
    watch([path.watch.html], function() {
        gulp.start('html:build');
    });
    watch([path.watch.style], function() {
        gulp.start('style:build');
    });
    watch([path.watch.js], function() {
        gulp.start('js:build');
    });
    watch([path.watch.img], function() {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function() {
        gulp.start('fonts:build');
    });
    watch([path.watch.allcss], function() {
        gulp.start('allcss:build');
    });
});

gulp.task('default', ['build', 'webserver', 'watch']);

//gulp uncss
gulp.task('uncss', function () {
    return gulp.src('production/css/*.css') //путь к файлу в котором будут вносится изменения

        .pipe(uncss({html: ['production/index.html']}))
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(gulp.dest(path.production.allcss))
        .pipe(gulp.dest('production/uncssed/')); // куда складывать
});