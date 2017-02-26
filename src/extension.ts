'use strict';

/**
 When the extension is activated by VS Code it activates its own helper to handle the linting and then registers that helper as a code action provider.
 */

import * as vscode from 'vscode';

import ElixirLintingProvider from './credoProvider';

export function activate(context: vscode.ExtensionContext) {
    let linter = new ElixirLintingProvider();
    linter.activate(context.subscriptions);
    vscode.languages.registerCodeActionsProvider('elixir', linter);
}