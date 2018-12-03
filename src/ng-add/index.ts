import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';

import { addPackageToPackageJson } from '../utils/package-config';
import { Schema } from './schema';

const NG_BOOTSTRAP_VERSION = "4.0.0";
const BOOTSTRAP_VERSION = "4.0.0";

/**
 * Schematic factory entry-point for the `ng-add` schematic. The ng-add schematic will be
 * automatically executed if developers run `ng add @ng-bootstrap/schematics`.
 */
export default function ngAdd(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    addPackageToPackageJson(
      host,
      "@ng-bootstrap/ng-bootstrap",
      `^${NG_BOOTSTRAP_VERSION}`
    );

    addPackageToPackageJson(host, "bootstrap", `^${BOOTSTRAP_VERSION}`);

    context.addTask(new RunSchematicTask("ng-add-setup-project", options), [
      context.addTask(new NodePackageInstallTask()),
    ]);
  };
}
