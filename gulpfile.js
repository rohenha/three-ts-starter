var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var buffer = require('vinyl-buffer');
var sass = require('gulp-sass'); // Permet de transformer les fichiers sass en fichiers css
var rename = require("gulp-rename"); // Permet de renommer les fichiers
var autoprefixer = require('gulp-autoprefixer'); //  Permet d'ajouter les autoprefixer aux instructions CSS3
var sourcemaps = require('gulp-sourcemaps'); // Permet de générer le sourcemap du fichier sass
var git = require('gulp-git'); // Permet de récupérer le git du projet
var stripCssComments = require('gulp-strip-css-comments'); // Permet de supprimer les commentaires du sass
var browserSync = require('browser-sync').create(); // Permet de créer la synchronisation du navigateur avec le code
var minify = require('gulp-minify'); // Permet de minimifier le Javascript
var concat = require('gulp-concat'); // Permet de concaténer les fichiers JS afin d'assembler plusieurs fichiers JS en un seul
var ts = require('gulp-typescript');
var tslint = require("gulp-tslint");
var uglifyify = require("uglifyify");
var del = require("del");
var tsProject = ts.createProject("tsconfig.json");
var paths = {
    pages: ['dev/html/*.html']
};

// We need to set up an error handler (which gulp-plumber calls).
// Otherwise, Gulp will exit if an error occurs, which is what we don't want.
var onError = function( err ) {
		console.error(err.toString());
    if (watching) {
        this.emit('end'); // jshint ignore:line
    } else {
        // if you want to be really specific
        process.exit(1);
    }
}

// Tâches pour le CSS
gulp.task('sass', function() {
	gulp.start('removeCSS');	
	gulp.src('dev/scss/master.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({ env : true, cascade : true, add : true, remove : true, supports : true, flexbox : true, grid : true }))
		.pipe(stripCssComments())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./app/css/'))
		.pipe(browserSync.stream());		

	// Pour minimifier css avec SASS
	return gulp.src('dev/scss/master.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
			env : true, cascade : true, add : true, remove : true, supports : true, flexbox : true, grid : true
		  }))
		.pipe(stripCssComments())
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./app/css/'))
		.pipe(browserSync.stream());

});


gulp.task('copyHtml', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('app'))
        .pipe(browserSync.stream());
});

gulp.task('tsLinter', function(){
	return gulp.src('dev/ts/*ts')
		.pipe(tslint({
			formatter: "verbose"
		}))
		.pipe(tslint.report())
});

gulp.task('ts', function () {
	gulp.start('removeJS');	
	var files = [
		'index.ts'
		// 'projects.ts'
	];
	var tasks = files.map(function(entry) {
		return browserify({
			basedir: '.',
			debug: true,
			entries: ["./dev/ts/" + entry],
			cache: {},
			packageCache: {}
		})
		.plugin(tsify)
		.transform('babelify', {
			presets: ['es2015'],
			extensions: ['.ts']
		})		.bundle()
		.pipe(source(entry))
		.pipe(rename({
			extname: '.bundle.js'
		}))
		.pipe(buffer())
		// .pipe(minify({
		// 	ext:{
		// 			src:'.js',
		// 			min:'.min.js'
		// 	}
		// }))
		.pipe(sourcemaps.init({loadMaps: true}))
		// .pipe(tsProject())			
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./app/js'))
		.pipe(browserSync.stream());
		es.merge(tasks).on('end', done);
	});
});

// Pour récupérer la structure du projet
gulp.task('createProjet', function() {
	git.clone('https://github.com/rohenha/html-template', function (err) {
		if (err) throw err;
  	});
});

gulp.task('removeCSS', function() {
	del(['app/css/*.css.map', '']).then(paths => {});
	del(['app/css/*.css', '']).then(paths => {});
});

gulp.task('removeJS', function() {
	del(['app/js/*.js.map', '!jquery.min.js.map']).then(paths => {
		// console.log('Deleted files and folders:\n', paths.join('\n'));
	});
	del(['app/js/*.js', '!jquery.min.js']).then(paths => {});
});

// Fonction principale à appeler pour lancer l'écoute
gulp.task( 'project', function() {
	gulp.start('init'); 
	browserSync.init({ server: "./app" }); 
	gulp.watch("dev/html/*.html", ['copyHtml']);	
	gulp.watch('dev/scss/partials/*.scss', ['sass']);
	gulp.watch("dev/ts/*.ts", ['tsLinter']);
	gulp.watch("dev/ts/*.ts", ['ts']);
});

gulp.task( 'init', function() {
    gulp.start('copyHtml');
    gulp.start('tsLinter');
    gulp.start('ts');
    gulp.start('sass');
});