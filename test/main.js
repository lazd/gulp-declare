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

    it('should declare namespaces', function(done) {
      var stream = handlebarsPlugin({
        outputType: 'browser',
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

    it('should declare the namespace for templates', function(done) {
      var stream = handlebarsPlugin({
        outputType: 'browser',
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
        contents.slice(0,174).should.equal('this["MyApp"] = this["MyApp"] || {};this["MyApp"]["Templates"] = this["MyApp"]["Templates"] || {};this["MyApp"]["Templates"]["App"] = this["MyApp"]["Templates"]["App"] || {};');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('should support custom processName functions', function(done) {
      var stream = handlebarsPlugin({
        outputType: 'browser',
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
        newFile.path.should.equal('fixtures/x.js');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

  });
});
