import * as vscode from "vscode";

export const parse = (check: string) => {
  const settings = vscode.workspace.getConfiguration("elixirLinter");

  /**
   * Consistency [C] -> Information
   * Readability [R] -> Information
   * Refactoring Opportunities [F] -> Hint
   * Software Design [D] -> Hint
   * Warnings [W] -> Warnings
   */
  const severity = ({
      C: settings.consistencySeverity || 2,
      D: settings.designSeverity || 3,
      F: settings.refactoringSeverity || 3,
      R: settings.readabilitySeverity || 2,
      W: settings.warningsSeverity || 1,
    })[check];

  if (severity) {
    return severity;
  }

  return settings.defaultSeverity || 1;
};
