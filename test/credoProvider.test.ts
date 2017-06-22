import * as assert from "assert";

import CredoProvider from "../src/credoProvider";

import * as fixtures from "../test/fixtures";

import * as vscode from "vscode";

suite("CredoProvider", () => {
  suite(".getDiagnosticInfo", () => {
    let credo;
    let mockCollection;

    setup(() => {
        mockCollection = vscode.languages.createDiagnosticCollection("mock");

        credo = new CredoProvider(mockCollection);
    });

    test("should be undefined if no params", () => {
      assert.equal(credo.getDiagnosticInfo(null), undefined);
    });

    test("should be undefined if position is falsy", () => {
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

    test("should be undefined if column is falsy", () => {
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

    test("should be undefined if column is less than 1", () => {
      assert.equal(credo.getDiagnosticInfo({column: -1}), undefined);
    });

    test("should be undefined if position is less than 1", () => {
      assert.equal(credo.getDiagnosticInfo({position: -20}), undefined);
    });

    test("should NOT be undefined if column and position are 1", () => {
      assert.ok(credo.getDiagnosticInfo({column: 1, position: 1}) !== undefined);
    });

    test("should result in startLine <= endLine", () => {
        [
          { column: 1, position: 1 },
          { column: 20, position: 5 },
          { column: 12, position: 101 },
        ].forEach((t) => {
          const result = credo.getDiagnosticInfo(t);
          assert.ok(result.startLine <=  result.endLine, `when column ${t.column} and position ${t.position}`);
        });
    });

    test("should result in startColumn <= endColumn", () => {
        [
          { column: 1, position: 1 },
          { column: 20, position: 5 },
          { column: 12, position: 101 },
        ].forEach((t) => {
          const result = credo.getDiagnosticInfo(t);
          assert.ok(result.startColumn <=  result.endColumn, `when column ${t.column} and position ${t.position}`);
        });
    });

    test("should have the expected message", () => {
      [
        {column: 1, position: 1, message: "We are number 1"},
        {column: 12, position: 31, message: 0},
        {column: 13, position: 31, message: "Unlucky !@#$%^&*()"},
      ].forEach((t) => {
        assert.equal(credo.getDiagnosticInfo(t).message, t.message);
      });
    });

    test("should have severity of vscode.DiagnosticSeverity.Warning", () => {
      assert.equal(credo.getDiagnosticInfo({column: 42, position: 24}).severity, 1);
    });
  });
});
