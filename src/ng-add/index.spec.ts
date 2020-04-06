import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { createTestApp, getFileContent } from '../utils/testing';

describe('NgBootstrap schematics', () => {
  let runner: SchematicTestRunner;
  let appTree: Tree;

  beforeEach(() => {
    runner = new SchematicTestRunner(
      'schematics',
      require.resolve('../collection.json')
    );
    appTree = createTestApp(runner);
  });

  it('should update package.json', () => {
    const tree = runner.runSchematic('ng-add', {}, appTree);
    const packageJson = JSON.parse(getFileContent(tree, '/package.json'));
    const dependencies = packageJson.dependencies;

    expect(dependencies['@ng-bootstrap/ng-bootstrap']).toBeDefined();
    expect(dependencies['bootstrap']).toBeDefined();
  });
});
