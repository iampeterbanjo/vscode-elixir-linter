'use strict';

import * as cmd from './command';
import * as assert from 'assert';

describe('command', () => {
  describe('getOptions', () => {
    it('cwd is rootPath', () => {
      let vscode = {
          workspace: {
            rootPath: './'
          }
        },
        options = cmd.getOptions(vscode);

      assert.equal(options.cwd, vscode.workspace.rootPath);
    });

    it('cwd is undefined', t => {
      let vscode = {
          workspace: {
            rootPath: false
          }
        },
        options = cmd.getOptions(vscode);
      assert.equal(options.cwd, undefined);
    });
  });
});
