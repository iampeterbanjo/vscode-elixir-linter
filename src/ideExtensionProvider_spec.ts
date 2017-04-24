import IdeExtensionProvider from './ideExtensionProvider';
import * as sinon from 'sinon';
import * as assert from 'assert';

describe('IdeExtensionProvider', () => {

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
})
