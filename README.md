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
Default: `"this"`

The namespace in which the file contents will be assigned. Use dot notation (e.g. `MyApp.Templates`) for nested namespaces.

For example, if the namespace is `MyApp.Templates` and a file is named `App.Header.js`, the following declaration will be added:

```javascript
this["MyApp"] = this["MyApp"] || {};
this["MyApp"]["templates"] = this["MyApp"]["templates"] || {};
this["MyApp"]["templates"]["App"] = this["MyApp"]["templates"]["App"] || {};
this["MyApp"]["templates"]["App"]["Header"] = /* File contents from App.Header.js */;
```

If the default value of `"this"` is provided, namespace declaration will be determined soley by the filename and output of `options.processName`. That is, a file names `MyApp.templates.App.Header.js` will result in the same declaration as above.


#### options.processName
Type: `Function`  
Default: Strip file extension

This option accepts a function which takes one argument (the filepath) and returns a string which will be used as the key for object. By default, the filename minus the extension is used.

If this function returns a string containing periods (not including the file extension), they will be represented as a sub-namespace. See `options.namespace` for an example of the effect.


#### options.noRedeclare
Type: `Boolean`  
Default: `false`

If `true`, parts of the namespace that were declared as a result of previous files in the stream will not be redeclared. For instance, if the stream contains the following files:

* Main.Content.js
* Main.Header.js
* Main.Footer.js

And if `declare` is invoked with `namespace: 'MyApp'` and `noRedeclare: true`, the contents of the streamed files will look like this:

**Main.Content.js**
```javascript
this["MyApp"] = this["MyApp"] || {};
this["MyApp"]["Main"] = this["MyApp"]["Main"] || {};
this["MyApp"]["Main"]["Content"] = /* File contents from Main.Content.js */;
```

**Main.Header.js**
```javascript
this["MyApp"]["Main"]["Header"] = /* File contents from Main.Header.js */;
```

**Main.Footer.js**
```javascript 
this["MyApp"]["Main"]["Footer"] = /* File contents from Main.Footer.js */;
```



[travis-url]: http://travis-ci.org/lazd/gulp-declare
[travis-image]: https://secure.travis-ci.org/lazd/gulp-declare.png?branch=master
[npm-url]: https://npmjs.org/package/gulp-declare
[npm-image]: https://badge.fury.io/js/gulp-declare.png
