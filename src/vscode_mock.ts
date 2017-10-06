import * as sinon from "sinon";
interface IDiagnosticCollection {
  clear: () => {};
  delete: () => {};
  dispose: () => {};
}

interface IDisposable {
  dispose: () => {};
}

export const commands = {
  registerCommand: (name: string, callback: () => any): IDisposable => {
    return {
      dispose: () => {
        return 0;
      },
    };
  },
};

export const languages = {
  createDiagnosticCollection: (name: string): IDiagnosticCollection => {
    return {
      clear: () => {
        return 0;
      },
      delete: () => {
        return 0;
      },
      dispose: () => {
        return 0;
      },
    };
  },
};

export const workspace = {
  getConfiguration: () => {
    return 0;
  },
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

export const Diagnostic = (range, message, severity) => {
  return {
    message,
    range,
    severity,
  };
};

export const textDocument = {
  getText: () => {
    return "hello world!";
  },
  languageId: "elixir",
  uri: "/path/to/file",
};

export const getMockConfiguration = (config?) => {
  const consistencyError = 10;
  const readabilityError = 11;
  const refactoringError = 12;
  const designError = 14;
  const warningsError = 15;

  return sinon.stub(workspace, "getConfiguration").callsFake(() => {
    return Object.assign({
      consistencySeverity: consistencyError,
      designSeverity: designError,
      readabilitySeverity: readabilityError,
      refactoringSeverity: refactoringError,
      useStrict: false,
      warningsSeverity: warningsError,
    }, config);
  });
};
