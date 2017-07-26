export const parse = (check: string, vscode) => {
  const settings = vscode.workspace.getConfiguration("elixirLinter");

  /**
   * 1 = Warning
   * 2 = Information
   * 3 = Hint
   * Consistency [C]
   * Readability [R]
   * Refactoring Opportunities [F]
   * Software Design [D]
   * Warnings [W]
   */
  const severity = ({
      C: settings.consistencySeverity || 1,
      D: settings.designSeverity || 1,
      F: settings.refactoringSeverity || 1,
      R: settings.readabilitySeverity || 1,
      W: settings.warningsSeverity || 1,
    })[check];

  if (severity) {
    return severity;
  }

  return settings.defaultSeverity || 1;
};
