import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { getWorkspace } from '@schematics/angular/utility/config';
import { getProject } from '@schematics/angular/utility/project';

import { getProjectStyleFile } from '../utils/project-style';
import { getProjectTargetOptions } from '../utils/project-targets';
import { createTestApp } from '../utils/testing';

describe('NgBootstrap schematics', () => {
  let runner: SchematicTestRunner;
  let appTree: Tree;

  beforeEach(() => {
    runner = new SchematicTestRunner(
      'schematics',
      require.resolve('../collection.json')
    );
  });

  it('should add Bootstrap CSS file on default CLI app', () => {
    appTree = createTestApp(runner);
    const tree = runner.runSchematic('ng-add-setup-project', {}, appTree);
    const workspace = getWorkspace(tree);
    const project = getProject(workspace, workspace.defaultProject!);
    const targetOptions = getProjectTargetOptions(project, 'build');

    expect(targetOptions.styles).toContain(
      'node_modules/bootstrap/dist/css/bootstrap.css'
    );
  });

  it('should setup Bootstrap SCSS on CLI app setup with Sass/SCSS', () => {
    appTree = createTestApp(runner, { style: 'scss' });

    const tree = runner.runSchematic('ng-add-setup-project', {}, appTree);
    const workspace = getWorkspace(tree);
    const project = getProject(workspace, workspace.defaultProject!);

    const expectedStylesPath = getProjectStyleFile(project);
    const buffer = tree.read(expectedStylesPath!);
    const styleContent = buffer!.toString();

    expect(styleContent).toContain(`@import '~bootstrap/scss/bootstrap';`);
  });
});
