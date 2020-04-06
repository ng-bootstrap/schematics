const fs = require('fs');
const path = require('path');

function cp(source, dest) {
  dest = path.resolve(dest);
  !fs.existsSync(path.dirname(dest)) && fs.mkdirSync(path.dirname(dest));
  fs.writeFileSync(
    dest,
    fs.readFileSync(require.resolve(source), 'utf-8'),
    'utf-8'
  );
}

// Copying schemas
cp('../src/collection.json', 'dist/collection.json');
cp('../src/ng-add/schema.json', 'dist/ng-add/schema.json');

// read oryginal package .json
const pkgJson = require('../package.json');

const targetPkgJson = {};

// copy some of the package.json fields from src to dest
[
  'name',
  'version',
  'description',
  'keywords',
  'author',
  'repository',
  'license',
  'bugs',
  'homepage',
].forEach(function (field) {
  targetPkgJson[field] = pkgJson[field];
});

// add dependencies (use the same versions as in the oryginal package.json)
targetPkgJson.dependencies = {};
[
  '@angular-devkit/core',
  '@angular-devkit/schematics',
  '@schematics/angular',
  'typescript',
].forEach(function (depPkg) {
  targetPkgJson.dependencies[depPkg] = pkgJson.dependencies[depPkg];
});

// add schematics entry
targetPkgJson['schematics'] = './collection.json';

// add keywords (https://twitter.com/stephenfluin/status/981979735839277056)
targetPkgJson.keywords = Array.from(
  new Set([
    ...(targetPkgJson.keywords || []),
    'angular-cli',
    'schematics',
    'ng-add',
  ])
);

// write down resulting package.json
fs.writeFileSync(
  'dist/package.json',
  JSON.stringify(targetPkgJson, null, 2),
  'utf-8'
);
