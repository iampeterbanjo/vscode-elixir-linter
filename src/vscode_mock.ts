interface IDisposable {
  dispose: () => {};
}

export const commands = {
  registerCommand: (name: string, callback: () => any) => {
    return 0;
  },
};

export const languages = {
  createDiagnosticCollection: (name: string): IDisposable => {
    return {
      dispose: () => {
        return 0;
      },
    };
  },
};

export const workspace = {
  onDidCloseTextDocument: () => {
    return 0;
  },
  onDidOpenTextDocument: () => {
    return 0;
  },
  onDidSaveTextDocument: () => {
    return 0;
  },
};
