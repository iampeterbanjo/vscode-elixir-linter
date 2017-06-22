"use strict";

import * as cp from "child_process";
import * as path from "path";

import * as vscode from "vscode";
import * as cmd from "./command";
import * as parse from "./parse";

import * as severity from "../src/severity";

import IdeExtensionProvider from "./ideExtensionProvider";

export default class ElixirLintingProvider {
    private static linterCommand: string = "mix";

    private command: vscode.Disposable;

    private diagnosticCollection: vscode.DiagnosticCollection;

    private extension: any;

    constructor(diagnosticCollection: vscode.DiagnosticCollection) {
        this.diagnosticCollection = diagnosticCollection;
        this.extension = new IdeExtensionProvider(this.diagnosticCollection, this.command);
    }

    /**
     * activate() and dispose() deal with set-up and tear-down in VS Code extensions.
     * The code below registers the command so that the CodeActionProvider can call it and
     *  sets up listeners to trigger the linting action.
     */

    public activate(subscriptions: vscode.Disposable[]) {
        this.extension.activate(this, subscriptions, vscode, this.linter);

        // Lint all open elixir documents
        vscode.workspace.textDocuments.forEach(this.linter, this);
    }

    public dispose(): void {
        this.extension.dispose();
    }

    public getDiagnosticInfo = (ILineInfo): any => {
        if (!ILineInfo) {
            return;
        }

        const isNotAnumber = isNaN(parseInt(ILineInfo.position, 10)) || isNaN(parseInt(ILineInfo.column, 10));
        const isLessThanOrEqualToZero = ILineInfo.position <= 0 || ILineInfo.column <= 0;

        if (isNotAnumber || isLessThanOrEqualToZero) {
            return;
        }

        return {
            endColumn: parse.makeZeroIndex(ILineInfo.column),
            endLine: parse.makeZeroIndex(ILineInfo.position),
            message: ILineInfo.message,
            severity: severity.parse(ILineInfo.check),
            startColumn: 0,
            startLine: parse.makeZeroIndex(ILineInfo.position),
        };
    }

    // getDiagnosis for vscode.diagnostics
    public getDiagnosis(item): vscode.Diagnostic {
        const range = new vscode.Range(
            item.endColumn,
            item.endLine,
            item.startColumn,
            item.startLine,
        );
        return new vscode.Diagnostic(range, item.message, item.severity);
    }

    public parseOutput(output) {
        return parse.getLines(output).map((error) => {
            const lineInfo = parse.getLineInfo(error);

            return this.getDiagnosticInfo(lineInfo);
        });
    }

    /**
     * Using cp.spawn(), extensions can call any executable and process the results.
     * The code below uses cp.spawn() to call linter, parses the output into Diagnostic objects
     * and then adds them to a DiagnosticCollection with this.diagnosticCollection.set(textDocument.uri, diagnostics);
     * which add the chrome in the UI.
     */

    private linter(textDocument: vscode.TextDocument) {
        if (textDocument.languageId !== "elixir") {
            return;
        }

        let decoded = "";
        const diagnostics: vscode.Diagnostic[] = [];

        let args =  ["credo", "list", "--format=oneline", "--read-from-stdin"];

        const settings = vscode.workspace.getConfiguration("elixirLinter");
        if (settings.useStrict === true) {
            args = args.concat("--strict");
        }

        // use stdin for credo to prevent running on entire project
        const childProcess = cp.spawn(ElixirLintingProvider.linterCommand, args, cmd.getOptions(vscode));
        childProcess.stdin.write(textDocument.getText());
        childProcess.stdin.end();

        if (childProcess.pid) {
            childProcess.stdout.on("data", (data: Buffer) => {
                decoded += data;
            });
            childProcess.stdout.on("end", () => {
                this.parseOutput(decoded).forEach( (item) => {
                    if (item) {
                        diagnostics.push(this.getDiagnosis(item));
                    }

                });
                this.diagnosticCollection.set(textDocument.uri, diagnostics);
            });
        }
    }
}
