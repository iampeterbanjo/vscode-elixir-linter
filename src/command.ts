interface IOptions {
    cwd?: string;
}

export let getOptions = (vscode): IOptions => {
  const options: IOptions = {};

  if (vscode.workspace.rootPath) {
      options.cwd = vscode.workspace.rootPath;
  }

  return options;
};
