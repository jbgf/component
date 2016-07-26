/*npm install gulp browser-sync gulp-connect-php run-sequence --save-dev;*/
var gulp=require('gulp'),
	
	browserSync=require('browser-sync'),
	
	
	connect = require('gulp-connect-php'),
	runSequence = require('run-sequence');

gulp.task('test',function(){								
	console.log('hello world!');							//直接在cmd界面显示；
});
gulp.task('fonts',function(){                              //不使用插件的一进一出；
	return gulp.src('source/fonts/**/*')
				.pipe(gulp.dest('dest/fonts'))
})

gulp.task('sass',function(){
	return gulp.src('source/**/*.scss')
			   .pipe(sass())
			   .pipe(gulp.dest('dest'))
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
	browserSync({

		proxy: "localhost:8001"			//处理php文件，gulp-connect-php默认监听8000，直接设置port：8000会发生占用，启用8001；
	})
});
gulp.task('watch',['browserSync','connectPhp'],function(){
	
	 gulp.watch(['login/*.html','login/*.js'],browserSync.reload);
	 gulp.watch(['head/*.js','head/*.css'],browserSync.reload);
	 gulp.watch(['sideBar/*.js','sideBar/*.css'],browserSync.reload);
	 gulp.watch(['poster/*.js','poster/*.css'],browserSync.reload);
	 gulp.watch(['details/*.js','details/*.css'],browserSync.reload);
	 gulp.watch(['ad/*.js','ad/*.css'],browserSync.reload);
	 gulp.watch(['comment/*.js','comment/*.css'],browserSync.reload);
	 gulp.watch(['common/*.js','common/*.css'],browserSync.reload);
	 gulp.watch(['explore/*.js','explore/*.css'],browserSync.reload);
	 gulp.watch(['like/*.js','like/*.css'],browserSync.reload);
	 gulp.watch(['pagination/*.js','pagination/*.css'],browserSync.reload);
	 gulp.watch(['backButton/*.js','backButton/*.css'],browserSync.reload);

	 gulp.watch(['html/likePage/*.js','html/likePage/*.css','html/likePage/*.html'],browserSync.reload);
	 
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
		bin:'D:/xampp/php/php.exe',
		ini: 'D:/xampp/php/php.ini',
		port:8001
  	});
  	gulp.watch('./*.php').on('change', function () {
    browserSync.reload();
  });
})