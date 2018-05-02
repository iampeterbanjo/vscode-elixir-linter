import * as crossSpawn from "cross-spawn";
import * as execa from "execa";
import * as findUp from "find-up";
import * as path from "path";
import * as shelljs from "shelljs";
import * as vscode from "vscode";

import { output } from "../test/fixtures";
import * as severity from "./severity";

const childProcess = require("child_process");

export function activate(context: vscode.ExtensionContext) {
  const collection = vscode.languages.createDiagnosticCollection("test");
  if (vscode.window.activeTextEditor) {
    updateDiagnostics(vscode.window.activeTextEditor.document, collection);
  }
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((e) =>
      updateDiagnostics(e.document, collection),
    ),
  );
}

type CredoIssue = {
  trigger: null;
  priority: number;
  message: string;
  line_no: null;
  filename: string;
  column_end: null;
  check: string;
  category: string;
};

type ShowDiagnostics = {
  collection: vscode.DiagnosticCollection;
  directory: string;
  issues: CredoIssue[];
  cwd: string;
};

type Entry = [vscode.Uri, [vscode.Diagnostic]];

// {
//   "trigger": null,
//   "priority": 10,
//   "message": "File is using unix line endings while most of the files use windows line endings.",
//   "line_no": null,
//   "filename": "web/web.ex",
//   "column_end": null,
//   "column": null,
//   "check": "Credo.Check.Consistency.LineEndings",
//   "category": "consistency"
// }
function showDiagnostics({ collection, directory, issues, cwd }: ShowDiagnostics) {
  const severityCode = {
    consistency: "C",
    design: "D",
    readability: "R",
    refactoring: "F",
    warnings: "W",
  };

  const entries = issues.map((i: CredoIssue): Entry => {
    // const s = severity.parse(severityCode[output.category], vscode);

    const filename = i.filename.replace(/\\/gi, "\/");
    const rootPath = cwd.replace(/\\/gi, "\/");
    const fullPath = `/${rootPath}\/${filename}`;
    const uri = vscode.Uri.parse(fullPath);
    // uri.scheme = "file";
    const defaultLine = 1;
    const defaultColumn = 1;
    const range = new vscode.Range(
      new vscode.Position(1, 1),
      new vscode.Position(1, 1),
    );
    const info = new vscode.Diagnostic(range, i.message, vscode.DiagnosticSeverity.Error);
    const targetFile = path.basename(i.filename);
    return [uri, [info]];
  });

  collection.set(entries);
}

function logError(error) {
  vscode.debug.activeDebugConsole.appendLine(error.stderr || error);
}

async function updateDiagnostics(
  document: vscode.TextDocument,
  collection: vscode.DiagnosticCollection,
): Promise<any> {
  if (!document || document.languageId !== "elixir") {
    return collection.clear();
  }

  const currentUri = document.uri;
  const documentPath = path.basename(document.uri.fsPath);
  const directory = await findUp("mix.exs", { cwd: document.uri.fsPath });

  runDiagnosticts({ directory, collection });
}

function getIssues({ cwd, directory}): Promise<CredoIssue[]> {
  const args = ["credo", "list", "--format=json"];

  vscode.debug.activeDebugConsole.appendLine(`Running mix ${args} in ${cwd}`);
  return new Promise((resolve, reject) => {
    childProcess.exec(`mix ${args.join(" ")}`, { cwd, env: {MIX_EXS: directory}}, (error, stdout, stderror) => {
      if (!stdout) {
        reject(error || "No credo issues found");
      }
      const pwd = shelljs.pwd();
      resolve(JSON.parse(stdout).issues);
    });
  });
}

type RunDiagnostics = {
  directory: string,
  collection: vscode.DiagnosticCollection,
};

async function runDiagnosticts({directory, collection}: RunDiagnostics): Promise<any> {
  if (!directory) {
    vscode.debug.activeDebugConsole.appendLine("No mix.exs found in current directory or parents");
  }

  const cwd = path.dirname(directory);
  try {
    const issues = await getIssues({ cwd, directory });
    showDiagnostics({ issues, collection, directory, cwd });
  } catch (error) {
    collection.clear();
    return logError(error);
  }

  // execa("mix", args, { cwd, env: {MIX_EXS: mixDirectory}})
  //   .finally((output) => showDiagnostics({ output, collection, uri: document.uri }));
}
