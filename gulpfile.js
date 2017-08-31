/*
npm install gulp gulp.spritesmith@4.1.1 vinyl-buffer gulp-csso gulp-imagemin merge-stream browser-sync gulp-connect-php run-sequence --save-dev;
sass 墙的原因，使用淘宝镜像，cnpm install sass --save-dev
*/
var gulp=require('gulp'),
	sass = require('gulp-sass'),
    express = require('express'),
    routes = require('./routes'),
	browserSync = require('browser-sync'),
	changed = require('gulp-changed'),
    spritesmith = require('gulp.spritesmith'),
	buffer = require('vinyl-buffer'),
    cons = require('consolidate'),
    path = require('path'),
	csso = require('gulp-csso'),
    nodemon = require('gulp-nodemon'),
	pkg = require('./package'),
    flash = require('connect-flash'),
	imagemin = require('gulp-imagemin'),
	merge = require('merge-stream'),
    sourcemaps = require('gulp-sourcemaps'),
	connect = require('gulp-connect-php'),
	config = require('./config'),
	runSequence = require('run-sequence');

// path 定义
var basedir = './'
var publicdir = './public'
var filepath = {
    'css': path.join(publicdir, 'css/**/*.css'),
    'scss': path.join(basedir, 'sass/**/*.scss'),
    'js': path.join(publicdir, 'js/**/*.js'),
    'view': path.join(basedir,'views/**/*.html')
    /*'view': path.join(basedir,'views/!**!/!*.pug')*/
}

gulp.task('sprite', function () {
    var spriteData = gulp.src('sprite/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }));

    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest('img/'));

    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
        .pipe(csso())
        .pipe(gulp.dest('css/'));

    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);
});

gulp.task('test',function(){								
	console.log('hello world!');							//直接在cmd界面显示；
});
gulp.task('fonts',function(){                              //不使用插件的一进一出；
	return gulp.src('source/fonts/**/*')
				.pipe(gulp.dest('dest/fonts'))
})

gulp.task('sass',function(){
	return gulp.src(['sass/web/*.scss','sass/mobile/*.scss','sass/mySassWare/*.scss'])
	/*只编译change的文件*/
			   .pipe(changed('css/',{extension:'.css'}))
		       .pipe(sourcemaps.init())
			   .pipe(sass().on('error', sass.logError))
		       .pipe(sourcemaps.write('./maps'))
			   .pipe(gulp.dest('css/'))
			   .pipe(browserSync.reload({
					stream:true
				}))
}); 
/*优化线路*/
gulp.task('build',function(callback){
	runSequence('clean:dest',
		['sass','useref','images','fonts'],
		callback)
})

/*开发线路*/
gulp.task('default',function(callback){
	runSequence(['browserSync','watch'],
		callback)
})
gulp.task('browserSync',function(){

   /* browserSync.init(null, {
        proxy: 'http://localhost:' + config.port,
        baseDir: ".",
        port: 5000
    })*/

	browserSync.init({
        server: {
            baseDir: "."
        }
    });
	 /*
	browserSync({

		proxy: "localhost:8002"			//处理php文件，gulp-connect-php默认监听8000，直接设置port：8000会发生占用，启用8001；
	})*/
});


var arr = ['button', 'topbar','navbar','footer','form','slider','special','sideBar','tab','list','map','iconGroup','affix','animate','header',
			'content','pagination','picText','input','logoRow','frame'];
	arr = arr.map(function (x) {
		return './'+x+'/**/*.html';
    })
gulp.task('watch',['browserSync'/*,'connectPhp'*/],function(){
    gulp.watch(arr,browserSync.reload);
    gulp.watch(['./sass/**/*.scss'],['sass']);
});
/*压缩*/
//src 相对于gulpfile，main.html的文件链接相对于main.html
gulp.task('useref',function(){
	return gulp.src('root/main.html')
				
				.pipe(useref())
				.pipe(gulpif('*.js', uglify()))         //如果js有语法错误不运行：
				.pipe(gulpif('*.css',minifyCSS()))  
				.pipe(gulp.dest('dest'))
				
});
gulp.task('images',function(){
	return gulp.src('source/images/*.+(png|jpg|jpeg|gif|svg)')    //jpg压缩率就2%；
			  //.pipe(imagemin())
				.pipe(cache(imagemin({					//压缩图片可能会占用较长时间，使用 gulp-cache 插件可以减少重复压缩。
							progressive: true,
							use:[imageminMozjpeg({quality:80})]		
									})					//png使用use: [pngquant({quality: '65-80'})]
									
					))
				.pipe(gulp.dest('dest/images'))
})

gulp.task('clean',function(callback){
	del('dest');
	return cache.clearAll(callback);					
})		//gulp-cache清楚缓存；因为压缩图片的时候用过，在删除整个文件夹后要清楚缓存；
gulp.task('clean:dest',function(callback){
	del(['dest/**/*','!dest/images','!dest/images/**/*'],callback)
})		//为了知道clean:dist任务什么时候完成，我们需要提供callback参数。

gulp.task('connectPhp',function(){
	connect.server({
		bin:'f:/xampp/php/php.exe',
		ini: 'f:/xampp/php/php.ini',
		port:8002
  	});
  	gulp.watch('./*.php').on('change', function () {
    browserSync.reload();
  });
})

