"use strict";

import * as cp from "child_process";
import * as path from "path";

import * as cmd from "./command";
import * as parse from "./parse";

import * as severity from "../src/severity";

import IdeExtensionProvider from "./ideExtensionProvider";

export default class ElixirLintingProvider {
    private static linterCommand: string = "mix";

    private command: any;

    private diagnosticCollection: any;

    private extension: any;

    private vscode: any;

    constructor(vscode) {
        this.vscode = vscode;
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection();
        this.extension = new IdeExtensionProvider(this.diagnosticCollection, this.command);
    }

    /**
     * activate() and dispose() deal with set-up and tear-down in VS Code extensions.
     * The code below registers the command so that the CodeActionProvider can call it and
     *  sets up listeners to trigger the linting action.
     */

    public activate(subscriptions: any[], vscode = this.vscode) {
        this.extension.activate(this, subscriptions, vscode, this.linter);

        // Lint all open elixir documents
        vscode.workspace.textDocuments.forEach((item, index) => {
            this.linter(item, index, vscode);
        });
    }

    public dispose(): void {
        this.extension.dispose();
    }

    // getDiagnosis for vscode.diagnostics
    public getDiagnosis(item, vscode= this.vscode): any {
        const range = new vscode.Range(
            item.startLine,
            item.startColumn,
            item.endLine,
            item.endColumn,
        );
        const itemSeverity = severity.parse(item.check, vscode);
        const message = `${item.message} [${item.check}:${itemSeverity}]`;
        return new vscode.Diagnostic(range, message, itemSeverity);
    }

    public makeZeroIndex = (value: number): number => {
        if (value <= 0) {
            return 0;
        }

        return value - 1;
    }

    public getDiagnosticInfo = (lineInfo): any => {
        if (!lineInfo) {
            return;
        }

        const isNotAnumber = isNaN(parseInt(lineInfo.position, 10)) || isNaN(parseInt(lineInfo.column, 10));
        const isLessThanOrEqualToZero = lineInfo.position <= 0 || lineInfo.column <= 0;

        if (isNotAnumber || isLessThanOrEqualToZero) {
            return;
        }

        return {
            check: lineInfo.check,
            endColumn: this.makeZeroIndex(lineInfo.column),
            endLine: this.makeZeroIndex(lineInfo.position),
            message: lineInfo.message,
            startColumn: 0,
            startLine: this.makeZeroIndex(lineInfo.position),
        };
    }

    public parseOutput(output) {
        return parse.getLines(output).map((error) => {
            const lineInfo = parse.getLineInfo(error);

            return this.getDiagnosticInfo(lineInfo);
        });
    }

    public getLinterArguments(): string[] {
        const settings = this.vscode.workspace.getConfiguration("elixirLinter");
        let args = ["credo", "list", "--format=oneline", "--read-from-stdin"];

        if (settings.useStrict === true) {
            args = args.concat("--strict");
        }
        if (settings.execName !== null) {
            args = args.concat(["-C", settings.execName]);
        }
        return args;
    }

    /**
     * Using cp.spawn(), extensions can call any executable and process the results.
     * The code below uses cp.spawn() to call linter, parses the output into Diagnostic objects
     * and then adds them to a DiagnosticCollection with this.diagnosticCollection.set(textDocument.uri, diagnostics);
     * which add the chrome in the UI.
     */

    private linter(textDocument: any, index, vscode = this.vscode) {
        if (textDocument.languageId !== "elixir") {
            return;
        }

        let decoded = "";
        const diagnostics: any[] = [];
        const args = this.getLinterArguments();

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
                        diagnostics.push(this.getDiagnosis(item, vscode));
                    }
                });
                this.diagnosticCollection.set(textDocument.uri, diagnostics);
            });
        }
    }
}
