interface Options {
    cwd?: string
}

export let getOptions = (vscode): Options => {
  let options: Options = {};

  if (vscode.workspace.rootPath) {
      options.cwd = vscode.workspace.rootPath;
  }

  return options;
}
