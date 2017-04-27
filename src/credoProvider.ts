'use strict';

import * as path from 'path';
import * as cp from 'child_process';

import * as vscode from 'vscode';
import * as cmd from './command';
import * as parse from './parse';
import IdeExtensionProvider from './ideExtensionProvider';

export default class ElixirLintingProvider {
    private static linterCommand: string = 'mix';

    private command: vscode.Disposable;

    private diagnosticCollection: vscode.DiagnosticCollection;

    private extension: any;

    constructor(diagnosticCollection: vscode.DiagnosticCollection) {
        this.diagnosticCollection = diagnosticCollection;
        this.extension = new IdeExtensionProvider(this.diagnosticCollection, this.command);
    }

    // getDiagnosis for vscode.diagnostics
    public getDiagnosis(item):vscode.Diagnostic {
        let range = new vscode.Range(
            item.startLine,
            item.startColumn,
            item.endLine,
            item.endColumn
        );
        return new vscode.Diagnostic(range, item.message, item.severity);
    }

    public parseOutput(output) {
        return parse.getLines(output).map(error => {
            let lineInfo = parse.getLineInfo(error);

            return parse.getDiagnosticInfo(lineInfo);
        });
    }

    /**
     Using cp.spawn(), extensions can call any executable and process the results. The code below uses cp.spawn() to call linter, parses the output into Diagnostic objects, and then adds them to a DiagnosticCollection with this.diagnosticCollection.set(textDocument.uri, diagnostics); which add the chrome in the UI.
     */

    private linter(textDocument: vscode.TextDocument) {
        if (textDocument.languageId !== 'elixir') {
            return;
        }

        let decoded = ''
        let diagnostics: vscode.Diagnostic[] = [];

        let args =  ['credo', 'list', '--format=oneline', '--read-from-stdin'];

        let settings = vscode.workspace.getConfiguration('elixirLinter');
        if (settings.useStrict) {
            args = args.concat('--strict');
        }

        // use stdin for credo to prevent running on entire project
        let childProcess = cp.spawn(ElixirLintingProvider.linterCommand, args, cmd.getOptions(vscode));
        childProcess.stdin.write(textDocument.getText());
        childProcess.stdin.end();

        if (childProcess.pid) {
            childProcess.stdout.on('data', (data: Buffer) => {
                decoded += data;
            });
            childProcess.stdout.on('end', () => {
                this.parseOutput(decoded).forEach( item => {
                    if (item) {
                        diagnostics.push(this.getDiagnosis(item));
                    }

                });
                this.diagnosticCollection.set(textDocument.uri, diagnostics);
            });
        }
    }

    /**
     activate() and dispose() deal with set-up and tear-down in VS Code extensions. The code below registers the command so that the CodeActionProvider can call it and sets up listeners to trigger the linting action.
     */

    public activate(subscriptions: vscode.Disposable[]) {
        this.extension.activate(this, subscriptions, vscode, this.linter);

        // Lint all open elixir documents
        vscode.workspace.textDocuments.forEach(this.linter, this);
    }

    public dispose(): void {
        this.extension.dispose();
    }
}
