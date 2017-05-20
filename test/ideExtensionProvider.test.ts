import * as assert from "assert";
import * as sinon from "sinon";

import IdeExtensionProvider from "../src/ideExtensionProvider";

import * as vscode from "vscode";

suite("IdeExtensionProvider", () => {
  let mockCommand;

  suiteSetup(() => {
      mockCommand = vscode.commands.registerCommand("mock", () => {
        return 0;
      });
  });

  suite(".removeFromDiagnosticCollection", () => {
    let ideExtensionProvider;
    let mockCollection;

    setup(() => {
        mockCollection = vscode.languages.createDiagnosticCollection("mock");

        ideExtensionProvider = new IdeExtensionProvider(mockCollection, mockCommand);
    });

    test("should call `collection.delete`", () => {
      const spy = sinon.spy();

      sinon.stub(ideExtensionProvider.diagnosticCollection, "delete").callsFake(spy);
      ideExtensionProvider.removeFromDiagnosticCollection();

      assert.ok(spy.calledOnce);

      ideExtensionProvider.diagnosticCollection.delete.restore();
    });

    test("should call `collection.delete`", () => {
      const spy = sinon.spy();

      sinon.stub(ideExtensionProvider.diagnosticCollection, "delete").callsFake(spy);
      ideExtensionProvider.removeFromDiagnosticCollection();

      assert.ok(spy.calledOnce);

      ideExtensionProvider.diagnosticCollection.delete.restore();
    });

    test("should call `collection.delete` with documentUri", () => {
      const spy = sinon.spy();
      const documentUri = "file://path/to/file";

      sinon.stub(ideExtensionProvider.diagnosticCollection, "delete").callsFake(spy);
      ideExtensionProvider.removeFromDiagnosticCollection(documentUri);

      assert.deepEqual(spy.getCall(0).args[0], documentUri);

      ideExtensionProvider.diagnosticCollection.delete.restore();
    });
  });

  suite(".dispose", () => {
    let ideExtensionProvider;
    let mockCollection;

    setup(() => {
        mockCollection = vscode.languages.createDiagnosticCollection("mock");

        ideExtensionProvider = new IdeExtensionProvider(mockCollection, mockCommand);
    });

    test("should call `collection.clear`", () => {
      const spy = sinon.spy();

      sinon.stub(ideExtensionProvider.diagnosticCollection, "clear").callsFake(spy);
      ideExtensionProvider.dispose();

      assert.ok(spy.calledOnce);

      ideExtensionProvider.diagnosticCollection.clear.restore();
    });

    test("should call `collection.dispose`", () => {
      const spy = sinon.spy();

      sinon.stub(ideExtensionProvider.diagnosticCollection, "dispose").callsFake(spy);
      ideExtensionProvider.dispose();

      assert.ok(spy.calledOnce);

      ideExtensionProvider.diagnosticCollection.dispose.restore();
    });

    test("should call `command.dispose`", () => {
      const spy = sinon.spy();

      sinon.stub(ideExtensionProvider.command, "dispose").callsFake(spy);
      ideExtensionProvider.dispose();

      assert.ok(spy.calledOnce);

      ideExtensionProvider.command.dispose.restore();
    });
  });

  suite(".activate", () => {
    let ideExtensionProvider;

    const subscriptions = [];
    const extension = {
          message: "I am the extension",
        };
    const linter = {
          message: "I am a linter",
        };

    setup(() => {
      ideExtensionProvider = new IdeExtensionProvider({}, {});
    });

    test("should add `extension` to `subscriptions`", () => {

      ideExtensionProvider.activate(extension, subscriptions, vscode);

      assert.ok(subscriptions.indexOf(extension) > -1);
    });

    test("should call vscode.workspace.onDidOpenTextDocument", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode.workspace, "onDidOpenTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode);

      assert.ok(spy.calledOnce);

      stub.restore();
    });

    test("should call vscode.workspace.onDidOpenTextDocument with linter", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode.workspace, "onDidOpenTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.deepEqual(spy.getCall(0).args[0], linter);

      stub.restore();
    });

    test("should call vscode.workspace.onDidOpenTextDocument with extension", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode.workspace, "onDidOpenTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.deepEqual(spy.getCall(0).args[1], extension);

      stub.restore();
    });

    test("should call vscode.workspace.onDidOpenTextDocument with subscriptions", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode.workspace, "onDidOpenTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.deepEqual(spy.getCall(0).args[2], subscriptions);

      stub.restore();
    });

    test("should call vscode.workspace.onDidCloseTextDocument", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode.workspace, "onDidCloseTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.ok(spy.calledOnce);

      stub.restore();
    });

    test(`should call vscode.workspace.onDidCloseTextDocument with
      ideExtensionProvider.removeFromDiagnosticCollection`, () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode.workspace, "onDidCloseTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.deepEqual(spy.getCall(0).args[0], ideExtensionProvider.removeFromDiagnosticCollection);

      stub.restore();
    });

    test("should call vscode.workspace.onDidCloseTextDocument with null", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode.workspace, "onDidCloseTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.deepEqual(spy.getCall(0).args[1], null);

      stub.restore();
    });

    test("should call vscode.workspace.onDidCloseTextDocument with subscriptions", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode.workspace, "onDidCloseTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.deepEqual(spy.getCall(0).args[2], subscriptions);

      stub.restore();
    });

    test("should call vscode.workspace.onDidSaveTextDocument", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode.workspace, "onDidSaveTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.ok(spy.calledOnce);

      stub.restore();
    });

    test("should call vscode.workspace.onDidSaveTextDocument with linter", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode.workspace, "onDidSaveTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.deepEqual(spy.getCall(0).args[0], linter);

      stub.restore();
    });

    test("should call vscode.workspace.onDidSaveTextDocument with extension", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode.workspace, "onDidSaveTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.deepEqual(spy.getCall(0).args[1], extension);

      stub.restore();
    });
  });
});
