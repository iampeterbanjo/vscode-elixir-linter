'use strict';

import * as path from 'path';
import * as cp from 'child_process';
import ChildProcess = cp.ChildProcess;

import * as vscode from 'vscode';
import * as cmd from './command';

export default class ElixirLintingProvider {

    private diagnosticCollection: vscode.DiagnosticCollection;

    // getDiagnosis for vscode.diagnostics
    public getDiagnosis(item):vscode.Diagnostic {
        let range = new vscode.Range(
            item.startLine - 1,
            item.startColumn - 1,
            item.endLine - 1,
            item.endColumn - 1
        );
        return new vscode.Diagnostic(range, item.message, item.severity);
    }

    public parseOutput(output): vscode.Diagnostic[] {
        return output.split('\n').map(error => {
            let matches = error.match(/^.*?:(\d+):?(\d+)?:\s(.*)/);

            if (!matches || !matches[1]) {
                return null;
            }

            let startLine = parseInt(matches[1]),
                startColumn = parseInt(matches[2]),
                endLine = isNaN(startColumn) ? 0 : startColumn,
                endColumn = isNaN(startColumn) ? Number.MAX_VALUE : startColumn,
                // range = {
                //     start: { line, character: isNaN(col) ? 0 : col },
                //     end: { line, character: isNaN(col) ? Number.MAX_VALUE : col }
                // },
                message = matches[3];

            return {
                startLine: startLine,
                startColumn: startColumn,
                endLine: endLine,
                endColumn: endColumn,
                severity: vscode.DiagnosticSeverity.Warning
            };
        });
    }

    private static linterCommand: string = 'mix';

    /**
     Using cp.spawn(), extensions can call any executable and process the results. The code below uses cp.spawn() to call linter, parses the output into Diagnostic objects, and then adds them to a DiagnosticCollection with this.diagnosticCollection.set(textDocument.uri, diagnostics); which add the chrome in the UI.
     */

    private linter(textDocument: vscode.TextDocument) {
        if (textDocument.languageId !== 'elixir') {
            return;
        }

        let decoded = ''
        let diagnostics: vscode.Diagnostic[] = [];

        let args =  ['credo', textDocument.fileName];

        let childProcess = cp.spawn(ElixirLintingProvider.linterCommand, args, cmd.getOptions(vscode));
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
     *
     The code below illustrates how to add code actions to the ElixirLintingProvider class shown above.
     */

    private static commandId: string = 'elixir.linter.runCodeAction';

    /**
     provideCodeActions() receives the diagnostics as a member of CodeActionContext and returns an array with a single command.
     */

    public provideCodeActions(document: vscode.TextDocument, range: vscode.Range, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.Command[] {
        let diagnostic:vscode.Diagnostic = context.diagnostics[0];
        return [{
            title: "Accept linter suggestions",
            command: ElixirLintingProvider.commandId,
            arguments: [document, diagnostic.range, diagnostic.message]
        }];
    }

    /**
     runCodeAction() is the function that we want to trigger if a user selects our action. Using the arguments passed along with the command it uses a WorkspaceEdit to fix a users code according to the suggestions of the linter.
     */

    private runCodeAction(document: vscode.TextDocument, range: vscode.Range, message:string): any {
        let fromRegex:RegExp = /.*Replace:(.*)==>.*/g
        let fromMatch:RegExpExecArray = fromRegex.exec(message.replace(/\s/g, ''));
        let from = fromMatch[1];
        let to:string = document.getText(range).replace(/\s/g, '')
        if (from === to) {
            let newText = /.*==>\s(.*)/g.exec(message)[1]
            let edit = new vscode.WorkspaceEdit();
            edit.replace(document.uri, range, newText);
            return vscode.workspace.applyEdit(edit);
        } else {
            vscode.window.showErrorMessage("The suggestion was not applied because it is out of date. You might have tried to apply the same edit twice.");
        }
    }

    /**
     activate() and dispose() deal with set-up and tear-down in VS Code extensions. The code below registers the command so that the CodeActionProvider can call it and sets up listeners to trigger the linting action.
     */

    private command: vscode.Disposable;

    public activate(subscriptions: vscode.Disposable[]) {
        this.command = vscode.commands.registerCommand(ElixirLintingProvider.commandId, this.runCodeAction, this);
        subscriptions.push(this);
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection();

        vscode.workspace.onDidOpenTextDocument(this.linter, this, subscriptions);
        vscode.workspace.onDidCloseTextDocument((textDocument)=> {
            this.diagnosticCollection.delete(textDocument.uri);
        }, null, subscriptions);

        vscode.workspace.onDidSaveTextDocument(this.linter, this);

        // Lint all open elixir documents
        vscode.workspace.textDocuments.forEach(this.linter, this);
    }

    public dispose(): void {
        this.diagnosticCollection.clear();
        this.diagnosticCollection.dispose();
        this.command.dispose();
    }
}