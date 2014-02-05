var map = require('vinyl-map');
var path = require('path');
var extend = require('xtend');

// Return a declaration and namespace name for output
var getNSInfo = function(ns, omitLast, alreadyDeclared) {
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
          // Avoid redeclaring parts of the namespace
          if (!alreadyDeclared || !alreadyDeclared[curPath]) {
            output.push(curPath + ' = ' + curPath + ' || {};');
          }

          // Store parts of the namespace that have been declared
          if (alreadyDeclared) {
            alreadyDeclared[curPath] = true;
          }
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
    namespace: 'this',
    noRedeclare: false
  }, options);

  // Support removal of duplicate declarations
  var alreadyDeclared = null;
  if (options.noRedeclare) {
    alreadyDeclared = {};
  }

  var declareNamespace = function(contents, filename) {
    contents = contents.toString();

    // Get the name of the template
    var name = options.processName(filename);

    // Prepend namespace to name
    if (options.namespace !== 'this') {
      name = options.namespace+'.'+name;
    }

    // Get namespace information for the final template name
    var nameNSInfo = getNSInfo(name, true, alreadyDeclared);

    // Add assignment
    contents = nameNSInfo.namespace+' = '+contents+';';

    // Tack on namespace declaration
    contents = nameNSInfo.declaration+contents;

    return contents;
  };

  return map(declareNamespace);
};
