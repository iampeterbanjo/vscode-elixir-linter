"use strict";

import * as assert from "assert";
import * as cmd from "./command";

describe("command", () => {
  describe("getOptions", () => {
    it("cwd is rootPath", () => {
      const vscode = {
          workspace: {
            rootPath: "./",
          },
        };
      const options = cmd.getOptions(vscode);

      assert.equal(options.cwd, vscode.workspace.rootPath);
    });

    it("cwd is undefined", () => {
      const vscode = {
          workspace: {
            rootPath: false,
          },
        };
      const options = cmd.getOptions(vscode);
      assert.equal(options.cwd, undefined);
    });
  });
});
