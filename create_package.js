const fs = require('fs');

// read oryginal package .json
const pkgJson = require('./package.json');

const targetPkgJson = {};

// copy some of the package.json fields from src to dest
['name', 'version', 'description', 'keywords', 'author', 'repository', 'license', 'bugs', 'homepage'].forEach(function (field) {
  targetPkgJson[field] = pkgJson[field];
});

// add dependencies (use the same versions as in the oryginal package.json)
targetPkgJson.dependencies = {};
['@angular-devkit/core', '@angular-devkit/schematics', 'typescript'].forEach(function(depPkg) {
  targetPkgJson.dependencies[depPkg] = pkgJson.devDependencies[depPkg];
});

// add schematics entry
targetPkgJson['schematics'] = './collection.json';

// add keywords (https://twitter.com/stephenfluin/status/981979735839277056)
targetPkgJson.keywords = ['angular', 'ng-bootstrap', 'ng-add'];

// write down resulting package.json
fs.writeFileSync('dist/package.json', JSON.stringify(targetPkgJson, null, 2), 'utf8');