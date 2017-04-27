import IdeExtensionProvider from './ideExtensionProvider';
import * as sinon from 'sinon';
import * as assert from 'assert';

describe('IdeExtensionProvider', () => {

  describe('.removeFromDiagnosticCollection', () => {
    let ideExtensionProvider, mockCollection, mockCommand;

    beforeEach(() => {
        mockCollection = {
          clear: () => {},
          delete: () => {},
          dispose: () => {}
        };

        mockCommand = {
          dispose: () => {}
        };

        ideExtensionProvider = new IdeExtensionProvider(mockCollection, mockCommand);
    });

    it('should call `collection.delete`', () => {
      let spy = sinon.spy();

      sinon.stub(ideExtensionProvider.diagnosticCollection, 'delete').callsFake(spy);
      ideExtensionProvider.removeFromDiagnosticCollection();

      assert.ok(spy.calledOnce);

      ideExtensionProvider.diagnosticCollection.delete.restore();
    });

    it('should call `collection.delete` with documentUri', () => {
      let spy = sinon.spy(),
          documentUri = 'file://path/to/file';

      sinon.stub(ideExtensionProvider.diagnosticCollection, 'delete').callsFake(spy);
      ideExtensionProvider.removeFromDiagnosticCollection(documentUri);

      assert.deepEqual(spy.getCall(0).args[0], documentUri);

      ideExtensionProvider.diagnosticCollection.delete.restore();
    });
  });

  describe('.dispose', () => {
    let ideExtensionProvider, mockCollection, mockCommand;

    beforeEach(() => {
        mockCollection = {
          clear: () => {},
          dispose: () => {}
        };

        mockCommand = {
          dispose: () => {}
        };

        ideExtensionProvider = new IdeExtensionProvider(mockCollection, mockCommand);
    });

    it('should call `collection.clear`', () => {
      let spy = sinon.spy();

      sinon.stub(ideExtensionProvider.diagnosticCollection, 'clear').callsFake(spy);
      ideExtensionProvider.dispose();

      assert.ok(spy.calledOnce);

      ideExtensionProvider.diagnosticCollection.clear.restore();
    });

    it('should call `collection.dispose`', () => {
      let spy = sinon.spy();

      sinon.stub(ideExtensionProvider.diagnosticCollection, 'dispose').callsFake(spy);
      ideExtensionProvider.dispose();

      assert.ok(spy.calledOnce);

      ideExtensionProvider.diagnosticCollection.dispose.restore();
    });

    it('should call `command.dispose`', () => {
      let spy = sinon.spy();

      sinon.stub(ideExtensionProvider.command, 'dispose').callsFake(spy);
      ideExtensionProvider.dispose();

      assert.ok(spy.calledOnce);

      ideExtensionProvider.command.dispose.restore();
    });
  });

  describe('.activate', () => {
    let ideExtensionProvider,
        subscriptions = [],
        extension = {
          message: 'I am the extension'
        },
        linter = {
          message: 'I am a linter'
        },
        vscode;


    beforeEach(() => {
      ideExtensionProvider = new IdeExtensionProvider({}, {});

      vscode = {
        workspace: {
          onDidOpenTextDocument: () => {},
          onDidCloseTextDocument: () => {},
          onDidSaveTextDocument: () => {}
        }
      };
    });

    it('should add `extension` to `subscriptions`', () => {

      ideExtensionProvider.activate(extension, subscriptions, vscode);

      assert.ok(subscriptions.indexOf(extension) > -1);
    });

    it('should call vscode.workspace.onDidOpenTextDocument', () => {
      let spy = sinon.spy();
      sinon.stub(vscode.workspace, 'onDidOpenTextDocument').callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode);

      assert.ok(spy.calledOnce);
    });

    it('should call vscode.workspace.onDidOpenTextDocument with linter', () => {
      let spy = sinon.spy(),
          linter = {
            message: 'I am a linter'
          };
      sinon.stub(vscode.workspace, 'onDidOpenTextDocument').callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.deepEqual(spy.getCall(0).args[0], linter);
    });

    it('should call vscode.workspace.onDidOpenTextDocument with extension', () => {
      let spy = sinon.spy();
      sinon.stub(vscode.workspace, 'onDidOpenTextDocument').callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.deepEqual(spy.getCall(0).args[1], extension);
    });

    it('should call vscode.workspace.onDidOpenTextDocument with subscriptions', () => {
      let spy = sinon.spy();
      sinon.stub(vscode.workspace, 'onDidOpenTextDocument').callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.deepEqual(spy.getCall(0).args[2], subscriptions);
    });


    it('should call vscode.workspace.onDidCloseTextDocument', () => {
      let spy = sinon.spy();
      sinon.stub(vscode.workspace, 'onDidCloseTextDocument').callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.ok(spy.calledOnce);
    });

    it('should call vscode.workspace.onDidCloseTextDocument with ideExtensionProvider.removeFromDiagnosticCollection', () => {
      let spy = sinon.spy();
      sinon.stub(vscode.workspace, 'onDidCloseTextDocument').callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.deepEqual(spy.getCall(0).args[0], ideExtensionProvider.removeFromDiagnosticCollection);
    });

    it('should call vscode.workspace.onDidCloseTextDocument with null', () => {
      let spy = sinon.spy();
      sinon.stub(vscode.workspace, 'onDidCloseTextDocument').callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.deepEqual(spy.getCall(0).args[1], null);
    });

    it('should call vscode.workspace.onDidCloseTextDocument with subscriptions', () => {
      let spy = sinon.spy();
      sinon.stub(vscode.workspace, 'onDidCloseTextDocument').callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.deepEqual(spy.getCall(0).args[2], subscriptions);
    });

    it('should call vscode.workspace.onDidSaveTextDocument', () => {
      let spy = sinon.spy();
      sinon.stub(vscode.workspace, 'onDidSaveTextDocument').callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.ok(spy.calledOnce);
    });

    it('should call vscode.workspace.onDidSaveTextDocument with linter', () => {
      let spy = sinon.spy();
      sinon.stub(vscode.workspace, 'onDidSaveTextDocument').callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.deepEqual(spy.getCall(0).args[0], linter);
    });

    it('should call vscode.workspace.onDidSaveTextDocument with extension', () => {
      let spy = sinon.spy();
      sinon.stub(vscode.workspace, 'onDidSaveTextDocument').callsFake(spy);

      ideExtensionProvider.activate(extension, subscriptions, vscode, linter);

      assert.deepEqual(spy.getCall(0).args[1], extension);
    });
  });
})
