import * as assert from "assert";

import CredoProvider from "../src/credoProvider";

import * as fixtures from "../test/fixtures";

import * as vscode_mock from "./vscode_mock";

describe("CredoProvider", () => {
  describe(".getDiagnosticInfo", () => {
    let credo;
    let mockCollection;

    beforeEach(() => {
        mockCollection = vscode_mock.languages.createDiagnosticCollection("mock");

        credo = new CredoProvider(mockCollection);
    });

    it("should be undefined if no params", () => {
      assert.equal(credo.getDiagnosticInfo(null), undefined);
    });

    it("should be undefined if position is falsy", () => {
      [
        {column: 3, position:  0},
        {column: 66, position: undefined},
        {column: 34, position: null},
        {column: 2, position:  false},
        {column: 21, position: ""},
      ].forEach((t) => {
        assert.equal(credo.getDiagnosticInfo(t), undefined);
      });
    });

    it("should be undefined if column is falsy", () => {
      [
        {position: 5, column: 0},
        {position: 6, column: undefined},
        {position: 90, column: null},
        {position: 25, column: false},
        {position: 65, column: ""},
      ].forEach((t) => {
        assert.equal(credo.getDiagnosticInfo(t), undefined);
      });
    });

    it("should be undefined if column is less than 1", () => {
      assert.equal(credo.getDiagnosticInfo({column: -1}), undefined);
    });

    it("should be undefined if position is less than 1", () => {
      assert.equal(credo.getDiagnosticInfo({position: -20}), undefined);
    });

    it("should NOT be undefined if column and position are 1", () => {
      assert.ok(credo.getDiagnosticInfo({column: 1, position: 1}) !== undefined);
    });

    it("should result in startLine <= endLine", () => {
        [
          { column: 1, position: 1 },
          { column: 20, position: 5 },
          { column: 12, position: 101 },
        ].forEach((t) => {
          const result = credo.getDiagnosticInfo(t);
          assert.ok(result.startLine <=  result.endLine, `when column ${t.column} and position ${t.position}`);
        });
    });

    it("should result in startColumn <= endColumn", () => {
        [
          { column: 1, position: 1 },
          { column: 20, position: 5 },
          { column: 12, position: 101 },
        ].forEach((t) => {
          const result = credo.getDiagnosticInfo(t);
          assert.ok(result.startColumn <=  result.endColumn, `when column ${t.column} and position ${t.position}`);
        });
    });

    it("should have the expected message", () => {
      [
        {column: 1, position: 1, message: "We are number 1"},
        {column: 12, position: 31, message: 0},
        {column: 13, position: 31, message: "Unlucky !@#$%^&*()"},
      ].forEach((t) => {
        assert.equal(credo.getDiagnosticInfo(t).message, t.message);
      });
    });

    it("should have severity of vscode_mock.DiagnosticSeverity.Warning", () => {
      assert.equal(credo.getDiagnosticInfo({column: 42, position: 24}).severity, 1);
    });
  });
});
