import { SchematicsException } from '@angular-devkit/schematics';
import { getProjectTargets } from '@schematics/angular/utility/project-targets';
import { WorkspaceProject } from '@schematics/angular/utility/workspace-models';

/** Resolves the options for the build target of the given project. */
export function getProjectTargetOptions(
  project: WorkspaceProject,
  buildTarget: string
) {
  const targets = getProjectTargets(project);
  if (targets && targets[buildTarget] && targets[buildTarget].options) {
    return targets[buildTarget].options;
  }

  throw new SchematicsException(
    `Cannot determine project target configuration for: ${buildTarget}.`
  );
}
