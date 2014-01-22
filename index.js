var es = require('event-stream');
var path = require('path');
var extend = require('xtend');

// Return a declaration and namespace name for output
var getNSInfo = function(ns, omitLast) {
  var output = [];
  var curPath = 'this';
  if (ns !== 'this') {
    var nsParts = ns.split('.');
    nsParts.some(function(curPart, index) {
      if (curPart !== 'this') {
        curPath += '[' + JSON.stringify(curPart) + ']';

        // Ignore the last part of the namespace, it will be used for assignment
        if (omitLast && index === nsParts.length - 1) {
          return true;
        }
        else {
          output.push(curPath + ' = ' + curPath + ' || {};');
        }
      }
    });
  }

  return {
    namespace: curPath,
    pathParts: output,
    declaration: output.join('')
  };
};

// Default name processing function should give the filename without extension
var defaultProcessName = function(name) { return path.basename(name, path.extname(name)); };

module.exports = function(options) {
  options = extend({
    processName: defaultProcessName,
    namespace: ''
  }, options);

  var declareNamespace = function(file, callback) {
    // Get the name of the template
    var name = options.processName(file.path);

    var contents = file.contents.toString();

    // Prepend namespace to name
    if (options.namespace !== false) {
      name = options.namespace+'.'+name;
    }

    // Get namespace information for the final template name
    var nameNSInfo = getNSInfo(name, true);

    // Add assignment
    contents = nameNSInfo.namespace+' = '+contents+';';

    // Tack on namespace declaration
    contents = nameNSInfo.declaration+contents;

    file.path = path.join(path.dirname(file.path), name+'.js');
    file.contents = new Buffer(contents);

    callback(null, file);
  };

  return es.map(declareNamespace);
};
