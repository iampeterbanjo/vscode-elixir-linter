import * as assert from "assert";

import CredoProvider from "../src/credoProvider";

import * as fixtures from "../test/fixtures";

import * as vscodeMock from "./vscode_mock";

describe("CredoProvider", () => {
  describe(".getDiagnosticInfo", () => {
    let credo;

    beforeEach(() => {
        credo = new CredoProvider(vscodeMock);
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

    it("should have expected `check`", () => {
      [
        {column: 42, position: 24, check: 1},
        {column: 42, position: 24, check: "W"},
        {column: 42, position: 24, check: undefined},
      ].forEach((t) => {
        assert.equal(credo.getDiagnosticInfo(t).check, t.check, `when check is ${t.check}`);
      });
    });
  });

  describe(".makeZeroIndex", () => {
    const credo = new CredoProvider(vscodeMock);

    it("should return 0 when value is less than 0", () => {
      assert.equal(credo.makeZeroIndex(0), 0);
    });

    it("should decrement value by 1 when value is greater than 0", () => {
      [
        {value: 0, expected: 0},
        {value: -1, expected: 0},
        {value: -31, expected: 0},
        {value: 2, expected: 1},
        {value: 5, expected: 4},
        {value: 700, expected: 699},
      ].forEach((t) => {
        assert.equal(credo.makeZeroIndex(t.value), t.expected);
      });
    });
  });
});
