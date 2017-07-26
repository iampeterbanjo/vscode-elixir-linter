export default class IdeExtensionProvider {
  private diagnosticCollection;
  private command;

  constructor(diagnosticCollection, command) {
    this.diagnosticCollection = diagnosticCollection;
    this.command = command;
  }

  public dispose = (): void => {
    this.diagnosticCollection.clear();
    this.diagnosticCollection.dispose();
    this.command.dispose();
  }

  public activate(extension, subscriptions, vscode, linter) {
    subscriptions.push(extension);

    vscode.workspace.onDidOpenTextDocument(linter, extension, subscriptions);
    vscode.workspace.onDidSaveTextDocument(linter, extension);
    vscode.workspace.onDidCloseTextDocument(this.removeFromDiagnosticCollection, null, subscriptions);
  }

  public removeFromDiagnosticCollection = (uri): void => {
    this.diagnosticCollection.delete(uri);
  }
}
