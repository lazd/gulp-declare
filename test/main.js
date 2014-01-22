var handlebarsPlugin = require('../');
var should = require('should');
var gutil = require('gulp-util');
var os = require('os');
var fs = require('fs');
var path = require('path');
require('mocha');

var getFixture = function(filePath) {
  filePath = path.join('test', 'fixtures', filePath);
  return new gutil.File({
    path: filePath,
    cwd: path.join('test', 'fixtures'),
    base: path.dirname(filePath),
    contents: fs.readFileSync(filePath)
  });
};

var getExpectedString = function(filePath) {
  return fs.readFileSync(path.join('test', 'expected', filePath), 'utf8');
};

var fileMatchesExpected = function(file, expectedFileName) {
    String(file.contents).should.equal(getExpectedString(expectedFileName));
};

describe('gulp-handlebars', function() {
  describe('handlebarsPlugin()', function() {

    it('should declare base namespaces', function(done) {
      var stream = handlebarsPlugin({
        namespace: 'MyApp.Templates',
        declareNamespace: true
      });

      var fakeFile = new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.Main.js'),
        contents: new Buffer('function() { return "Main"; }')
      });

      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);
        var contents = String(newFile.contents);
        contents.slice(0, 98).should.equal('this["MyApp"] = this["MyApp"] || {};this["MyApp"]["Templates"] = this["MyApp"]["Templates"] || {};');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('should assign as a property of a namespace', function(done) {
      var stream = handlebarsPlugin({
        namespace: 'MyApp.Templates',
        declareNamespace: true
      });

      var fakeFile = new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.js'),
        contents: new Buffer('function() { return "App"; }')
      });

      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);
        var contents = String(newFile.contents);
        contents.should.equal('this["MyApp"] = this["MyApp"] || {};this["MyApp"]["Templates"] = this["MyApp"]["Templates"] || {};this["MyApp"]["Templates"]["App"] = function() { return "App"; };');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('should assign as a property of a sub-namespace', function(done) {
      var stream = handlebarsPlugin({
        namespace: 'MyApp.Templates',
        declareNamespace: true
      });

      var fakeFile = new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.Main.js'),
        contents: new Buffer('function() { return "App"; }')
      });

      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);
        var contents = String(newFile.contents);
        contents.should.equal('this["MyApp"] = this["MyApp"] || {};this["MyApp"]["Templates"] = this["MyApp"]["Templates"] || {};this["MyApp"]["Templates"]["App"] = this["MyApp"]["Templates"]["App"] || {};this["MyApp"]["Templates"]["App"]["Main"] = function() { return "App"; };');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('should support custom processName functions', function(done) {
      var stream = handlebarsPlugin({
        namespace: false,
        processName: function(name) {
          return 'x';
        }
      });

      var fakeFile = new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.Main.js'),
        contents: new Buffer('function() { return "Main"; }')
      });

      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.path);
        var contents = String(newFile.contents);
        contents.should.equal('this["x"] = function() { return "Main"; };');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('should support custom processName functions with namespaces', function(done) {
      var stream = handlebarsPlugin({
        namespace: 'App',
        processName: function(name) {
          return 'Main';
        }
      });

      var fakeFile = new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.Main.js'),
        contents: new Buffer('function() { return "Main"; }')
      });

      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.path);
        var contents = String(newFile.contents);
        contents.should.equal('this["App"] = this["App"] || {};this["App"]["Main"] = function() { return "Main"; };');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

  });
});
