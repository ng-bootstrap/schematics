import { chain, Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { getWorkspace } from '@schematics/angular/utility/config';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { getProject } from '@schematics/angular/utility/project';
import * as path from 'path';
import * as ts from 'typescript';

import { getProjectStyleFile } from '../utils/project-style';
import { getProjectTargetOptions } from '../utils/project-targets';
import { Schema } from './schema';

const NG_BOOTSTRAP_MODULE_NAME = "NgbModule";
const NG_BOOTSTRAP_PACKAGE_NAME = "@ng-bootstrap/ng-bootstrap";
const BOOTSTRAP_CSS_FILEPATH = "node_modules/bootstrap/dist/css/bootstrap.css";
const BOOTSTRAP_STYLE_IMPORT = `
/* Importing Bootstrap SCSS file. */
@import '~bootstrap/scss/bootstrap';
`;

function addNgBootstrapModuleToAppModule(options: Schema) {
  return (host: Tree) => {
    const workspace = getWorkspace(host);
    const project = getProject(
      workspace,
      options.project || workspace.defaultProject!
    );
    const buildOptions = getProjectTargetOptions(project, "build");

    const modulePath = getAppModulePath(host, buildOptions.main);

    const text = host.read(modulePath);
    if (text === null) {
      throw new SchematicsException(`File ${modulePath} does not exist.`);
    }

    const source = ts.createSourceFile(
      modulePath,
      text.toString("utf-8"),
      ts.ScriptTarget.Latest,
      true
    );

    const changes = addImportToModule(
      source,
      modulePath,
      NG_BOOTSTRAP_MODULE_NAME,
      NG_BOOTSTRAP_PACKAGE_NAME
    );

    const recorder = host.beginUpdate(modulePath);
    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(recorder);
    return host;
  };
}

function addBootstrapStyle(options: Schema) {
  return (host: Tree) => {
    const workspace = getWorkspace(host);
    const project = getProject(
      workspace,
      options.project || workspace.defaultProject!
    );
    const styleFilePath = getProjectStyleFile(project);

    if (styleFilePath) {
      let useBootstrapSCSS = false;
      const schematicsConfig = project.schematics;
      if (
        schematicsConfig &&
        schematicsConfig["@schematics/angular:component"]
      ) {
        const { styleext } = schematicsConfig["@schematics/angular:component"];
        useBootstrapSCSS =
          styleext &&
          `.${styleext}` === path.extname(styleFilePath) &&
          styleext === "scss";
      }

      if (useBootstrapSCSS) {
        injectBootstrapIntoStyleFile(host, styleFilePath);
      } else {
        addCSSFileToTarget(options, host, BOOTSTRAP_CSS_FILEPATH);
      }
    }
    return host;
  };
}

function injectBootstrapIntoStyleFile(host: Tree, styleFilePath: string) {
  const styleContent = host.read(styleFilePath)!.toString("utf-8");

  const recorder = host.beginUpdate(styleFilePath);
  recorder.insertRight(styleContent.length, BOOTSTRAP_STYLE_IMPORT);

  host.commitUpdate(recorder);
}

function addCSSFileToTarget(options: Schema, host: Tree, assetPath: string) {
  const workspace = getWorkspace(host);
  const project = getProject(
    workspace,
    options.project || workspace.defaultProject!
  );
  const targetOptions = getProjectTargetOptions(project, "build");
  if (!targetOptions.styles) {
    targetOptions.styles = [assetPath];
  } else {
    const existingStyles = targetOptions.styles.map(s =>
      typeof s === "string" ? s : s.input
    );
    for (const [, stylePath] of existingStyles.entries()) {
      // If the given asset is already specified in the styles, we don't need to do anything.
      if (stylePath === assetPath) {
        return;
      }
    }
    targetOptions.styles.unshift(assetPath);
  }
  host.overwrite("angular.json", JSON.stringify(workspace, null, 2));
}

/**
 * Make sure basic skeleton of a NgBootstrap application is applied, this includes:
 *  - Adding NgBootstrap module to app.module
 *  - Adding bootstrap (css or scss) themes
 */
export default function ngAddSetupProject(options: Schema): Rule {
  return chain([
    addNgBootstrapModuleToAppModule(options),
    addBootstrapStyle(options),
  ]);
}
