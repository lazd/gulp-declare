# gulp-declare [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url]
> declare plugin for gulp 3

## Usage

First, install `gulp-declare` as a development dependency:

```shell
npm install --save-dev gulp-declare
```

Then, add it to your `gulpfile.js`:

```javascript
var handlebars = require('gulp-handlebars');
var declare = require('gulp-declare');

gulp.task('templates', function(){
  gulp.src(['client/templates/*.hbs'])
    .pipe(handlebars()) // returns a bare function
    .pipe(declare({
      namespace: 'MyApp.templates'
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('build/js/'));
});
```

## API

### declare(options)

#### options.namespace
Type: `String`  
Default: Empty string

The namespace in which the file contents will be assigned. Use dot notation (e.g. `App.Templates`) for nested namespaces or false to declare templates in the global namespace.

For example, if the namespace is `MyApp.Templates` and a template is named `App.Header.hbs`, the following declaration will be present in the output file for that template:

```javascript
this["MyApp"] = this["MyApp"] || {};
this["MyApp"]["templates"] = this["MyApp"]["templates"] || {};
this["MyApp"]["templates"]["App"] = this["MyApp"]["templates"]["App"] || {};
this["MyApp"]["templates"]["App"]["Header"] = function () {};
```

When processing multiple templates under a given namespace, this will result in duplicate declarations. That is, the non-destructive declaration of the namespace will be repeated for each template compiled.

#### options.processName
Type: `Function`  
Default: Strip file extension

This option accepts a function which takes one argument (the filepath) and returns a string which will be used as the key for object. By default, the filename minus the extension is used.

If this function returns a string containing periods (not including the file extension), they will be represented as a sub-namespace. See `options.namespace` for an example of the effect.


[travis-url]: http://travis-ci.org/lazd/gulp-declare
[travis-image]: https://secure.travis-ci.org/lazd/gulp-declare.png?branch=master
[npm-url]: https://npmjs.org/package/gulp-declare
[npm-image]: https://badge.fury.io/js/gulp-declare.png
