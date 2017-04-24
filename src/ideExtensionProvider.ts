export default class IdeExtensionProvider {
  private diagnosticCollection;
  private command;

  constructor(diagnosticCollection, command) {
    this.diagnosticCollection = diagnosticCollection;
    this.command = command;
  }

  public dispose = ():void => {
    this.diagnosticCollection.clear();
    this.diagnosticCollection.dispose();
    this.command.dispose();
  }
}
