# Developer Guide

1. Make sure `node` is installed with a version at _least_ 10.0.0
2. We are using `yarn`, make sure you have it installed.
3. We recommand using `nvm` to manage different node versions locally.
4. Fork and clone to your machine the `ng-bootstrap/schematics` repository.
5. From the root of the project, run `yarn`.

### Building the project

To build the project, run `yarn build`. To incrementally re-buid the project on file changes, run `yarn build --watch`.

### Running tests

Project only support unit tests. To run them, run `yarn test`.
To run them in watch mode, run `yarn test --watch` and follow Jest CLI options.

### Testing live locally

In order to test locally on a given Angular CLI application, you must install globally `@angular-devkit/schematics-cli` and use `schematics` command line tool:

2. start the build task in watch mode, run `yarn build --watch`
3. scaffold an application using Angular CLI, run `ng new testApp && cd testApp`
4. test with `schematics <path-to-your-clone>/dist/collection.json:<schematic-name> --eventual-option=option-value`

By default, `schematics` will behave as Angular CLI, expect a few different default values such as `--debug` mode which is active, and `--dry-run` which is `false`.

For more options, checkout `schematics` documentation with `schematics --help`
