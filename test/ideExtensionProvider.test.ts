import IdeExtensionProvider from '../src/ideExtensionProvider';
import * as sinon from 'sinon';
import * as assert from 'assert';

import * as vscode from 'vscode';

suite('IdeExtensionProvider', () => {

  suite('.removeFromDiagnosticCollection', () => {
    let ideExtensionProvider, mockCollection, mockCommand;

    setup(() => {
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

    test('should call `collection.delete`', () => {
      let spy = sinon.spy();

      sinon.stub(ideExtensionProvider.diagnosticCollection, 'delete').callsFake(spy);
      ideExtensionProvider.removeFromDiagnosticCollection();

      assert.ok(spy.calledOnce);

      ideExtensionProvider.diagnosticCollection.delete.restore();
    });
  });
});
