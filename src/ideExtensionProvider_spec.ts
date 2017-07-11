import * as assert from "assert";
import * as sinon from "sinon";

import IdeExtensionProvider from "../src/ideExtensionProvider";

import * as vscode_mock from "./vscode_mock";

describe("IdeExtensionProvider", () => {
  let mockCommand;

  beforeEach(() => {
      mockCommand = vscode_mock.commands.registerCommand("mock", () => {
        return 0;
      });
  });

  describe(".removeFromDiagnosticCollection", () => {
    let ideExtensionProvider;
    let mockCollection;

    beforeEach(() => {
        mockCollection = vscode_mock.languages.createDiagnosticCollection("mock");

        ideExtensionProvider = new IdeExtensionProvider(mockCollection, mockCommand);
    });

    it("should call `collection.delete`", () => {
      const spy = sinon.spy();

      sinon.stub(ideExtensionProvider.diagnosticCollection, "delete").callsFake(spy);
      ideExtensionProvider.removeFromDiagnosticCollection();

      assert.ok(spy.calledOnce);

      ideExtensionProvider.diagnosticCollection.delete.restore();
    });

    it("should call `collection.delete`", () => {
      const spy = sinon.spy();

      sinon.stub(ideExtensionProvider.diagnosticCollection, "delete").callsFake(spy);
      ideExtensionProvider.removeFromDiagnosticCollection();

      assert.ok(spy.calledOnce);

      ideExtensionProvider.diagnosticCollection.delete.restore();
    });

    it("should call `collection.delete` with documentUri", () => {
      const spy = sinon.spy();
      const documentUri = "file://path/to/file";

      sinon.stub(ideExtensionProvider.diagnosticCollection, "delete").callsFake(spy);
      ideExtensionProvider.removeFromDiagnosticCollection(documentUri);

      assert.deepEqual(spy.getCall(0).args[0], documentUri);

      ideExtensionProvider.diagnosticCollection.delete.restore();
    });
  });

  describe(".dispose", () => {
    let ideExtensionProvider;
    let mockCollection;

    beforeEach(() => {
        mockCollection = vscode_mock.languages.createDiagnosticCollection("mock");

        ideExtensionProvider = new IdeExtensionProvider(mockCollection, mockCommand);
    });

    it("should call `collection.clear`", () => {
      const spy = sinon.spy();

      sinon.stub(ideExtensionProvider.diagnosticCollection, "clear").callsFake(spy);
      ideExtensionProvider.dispose();

      assert.ok(spy.calledOnce);

      ideExtensionProvider.diagnosticCollection.clear.restore();
    });

    it("should call `collection.dispose`", () => {
      const spy = sinon.spy();

      sinon.stub(ideExtensionProvider.diagnosticCollection, "dispose").callsFake(spy);
      ideExtensionProvider.dispose();

      assert.ok(spy.calledOnce);

      ideExtensionProvider.diagnosticCollection.dispose.restore();
    });

    it("should call `command.dispose`", () => {
      const spy = sinon.spy();

      sinon.stub(ideExtensionProvider.command, "dispose").callsFake(spy);
      ideExtensionProvider.dispose();

      assert.ok(spy.calledOnce);

      ideExtensionProvider.command.dispose.restore();
    });
  });

  describe(".activate", () => {
    let ideExtensionProvider;

    const subscriptions = [];
    const extension = {
          message: "I am the extension",
        };
    const linter = {
          message: "I am a linter",
        };

    beforeEach(() => {
      ideExtensionProvider = new IdeExtensionProvider({}, {});
    });

    it("should add `extension` to `subscriptions`", () => {

      ideExtensionProvider.activate(extension, subscriptions, vscode_mock);

      assert.ok(subscriptions.indexOf(extension) > -1);
    });

    it("should call vscode_mock.workspace.onDidOpenTextDocument", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode_mock.workspace, "onDidOpenTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode_mock);

      assert.ok(spy.calledOnce);

      stub.restore();
    });

    it("should call vscode_mock.workspace.onDidOpenTextDocument with linter", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode_mock.workspace, "onDidOpenTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode_mock, linter);

      assert.deepEqual(spy.getCall(0).args[0], linter);

      stub.restore();
    });

    it("should call vscode_mock.workspace.onDidOpenTextDocument with extension", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode_mock.workspace, "onDidOpenTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode_mock, linter);

      assert.deepEqual(spy.getCall(0).args[1], extension);

      stub.restore();
    });

    it("should call vscode_mock.workspace.onDidOpenTextDocument with subscriptions", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode_mock.workspace, "onDidOpenTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode_mock, linter);

      assert.deepEqual(spy.getCall(0).args[2], subscriptions);

      stub.restore();
    });

    it("should call vscode_mock.workspace.onDidCloseTextDocument", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode_mock.workspace, "onDidCloseTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode_mock, linter);

      assert.ok(spy.calledOnce);

      stub.restore();
    });

    it(`should call vscode_mock.workspace.onDidCloseTextDocument with
      ideExtensionProvider.removeFromDiagnosticCollection`, () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode_mock.workspace, "onDidCloseTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode_mock, linter);

      assert.deepEqual(spy.getCall(0).args[0], ideExtensionProvider.removeFromDiagnosticCollection);

      stub.restore();
    });

    it("should call vscode_mock.workspace.onDidCloseTextDocument with null", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode_mock.workspace, "onDidCloseTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode_mock, linter);

      assert.deepEqual(spy.getCall(0).args[1], null);

      stub.restore();
    });

    it("should call vscode_mock.workspace.onDidCloseTextDocument with subscriptions", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode_mock.workspace, "onDidCloseTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode_mock, linter);

      assert.deepEqual(spy.getCall(0).args[2], subscriptions);

      stub.restore();
    });

    it("should call vscode_mock.workspace.onDidSaveTextDocument", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode_mock.workspace, "onDidSaveTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode_mock, linter);

      assert.ok(spy.calledOnce);

      stub.restore();
    });

    it("should call vscode_mock.workspace.onDidSaveTextDocument with linter", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode_mock.workspace, "onDidSaveTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode_mock, linter);

      assert.deepEqual(spy.getCall(0).args[0], linter);

      stub.restore();
    });

    it("should call vscode_mock.workspace.onDidSaveTextDocument with extension", () => {
      const spy = sinon.spy();
      const stub = sinon.stub(vscode_mock.workspace, "onDidSaveTextDocument").callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode_mock, linter);

      assert.deepEqual(spy.getCall(0).args[1], extension);

      stub.restore();
    });
  });
});
