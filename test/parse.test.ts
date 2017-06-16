import * as assert from "assert";

import * as parse from "../src/parse";
import * as fixtures from "../test/fixtures";

suite("parse", () => {
  suite(".getLines", () => {
    test("should get correct number of lines", () => {
      [
        {output: null, expected: 0},
        {output: "", expected: 0},
        {output: "three \n new \n lines \n", expected: 3},
        {output: "one liner \n", expected: 1},
        {output: "no new line", expected: 1},
      ].forEach((test) => {
        const result = parse.getLines(test.output);

        assert.equal(result.length, test.expected);
      });
    });

    test("should get correct number of lines for credo output", () => {
      const result = parse.getLines(fixtures.output.listOneline);

      assert.equal(result.length, 6);
    });
  });

  suite(".getFileInfo", () => {
    test("should return an empty string by default", () => {
      assert.equal(parse.getFileInfo(""), "");
    });

    test("should return expected item from file information", () => {
      const line = "[W] → lib/rumbl.ex:27:7 Functions should have a @spec type specification.";
      const testTree = [
        {
          expected: "lib/rumbl.ex",
          value: undefined,
        },
        {
          expected: "lib/rumbl.ex",
          value: 0,
        },
        {
          expected: 27,
          value: 1,
        },
        {
          expected: 7,
          value: 2,
        },
        {
          expected: [],
          value: 5,
        },
      ];

      testTree.forEach((t) => {
        const result = parse.getFileInfo(line, t.value);
        const error = `${result} === ${t.expected} when value is "${t.value}"`;
        assert.equal(result, t.expected, error);
      });
    });
  });

  suite(".getLineInfoCheck", () => {
    test("should get expected check", () => {
      fixtures.output.testTree.forEach((t) => {
        const result = parse.getLineInfoCheck({}, t.line).check;
        const error = `${result} === ${t.expected.check} when line is "${t.line}"`;
        assert.equal(result, t.expected.check, error);
      });
    });
  });

  suite(".getLineInfoColumn", () => {
    test("should get expected line column", () => {
      fixtures.output.testTree.forEach((t) => {
        const result = parse.getLineInfoColumn({}, t.line).column;
        const error = `${result} === ${t.expected.column} when line is "${t.line}"`;
        assert.equal(result, t.expected.column, error);
      });
    });
  });

  suite(".getLineInfoMessage", () => {
    test("should get expected message", () => {
      fixtures.output.testTree.forEach((t) => {
        const result = parse.getLineInfoMessage({}, t.line).message;
        const error = `${result} === ${t.expected.message} when line is "${t.line}"`;
        assert.equal(result, t.expected.message, error);
      });
    });
  });

  suite(".getLineInfoPosition", () => {
    test("should get expected position", () => {
      fixtures.output.testTree.forEach((t) => {
        const result = parse.getLineInfoPosition({}, t.line).position;
        const error = `${result} === ${t.expected.position} when line is "${t.line}"`;
        assert.equal(result, t.expected.position, error);
      });
    });
  });

  suite(".getLineInfo", () => {
    test("should get expected info", () => {
      fixtures.output.testTree.forEach((t) => {
        const result = parse.getLineInfo(t.line);
        const error = `${result} === ${t.expected} when line is "${t.line}"`;
        assert.deepEqual(result, t.expected, error);
      });
    });
  });

  suite(".getDiagnosticInfo", () => {
    test("should be undefined if no params", () => {
      assert.equal(parse.getDiagnosticInfo(null), undefined);
    });

    test("should be undefined if position is falsy", () => {
      [
        {column: 3, position:  0},
        {column: 66, position: undefined},
        {column: 34, position: null},
        {column: 2, position:  false},
        {column: 21, position: ""},
      ].forEach((t) => {
        assert.equal(parse.getDiagnosticInfo(t), undefined);
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
        assert.equal(parse.getDiagnosticInfo(t), undefined);
      });
    });

    test("should be undefined if column is less than 1", () => {
      assert.equal(parse.getDiagnosticInfo({column: -1}), undefined);
    });

    test("should be undefined if position is less than 1", () => {
      assert.equal(parse.getDiagnosticInfo({position: -20}), undefined);
    });

    test("should NOT be undefined if column and position are 1", () => {
      assert.ok(parse.getDiagnosticInfo({column: 1, position: 1}) !== undefined);
    });

    test("should result in startLine <= endLine", () => {
        [
          { column: 1, position: 1 },
          { column: 20, position: 5 },
          { column: 12, position: 101 },
        ].forEach((t) => {
          const result = parse.getDiagnosticInfo(t);
          assert.ok(result.startLine <=  result.endLine, `when column ${t.column} and position ${t.position}`);
        });
    });

    test("should result in startColumn <= endColumn", () => {
        [
          { column: 1, position: 1 },
          { column: 20, position: 5 },
          { column: 12, position: 101 },
        ].forEach((t) => {
          const result = parse.getDiagnosticInfo(t);
          assert.ok(result.startColumn <=  result.endColumn, `when column ${t.column} and position ${t.position}`);
        });
    });

    test("should have the expected message", () => {
      [
        {column: 1, position: 1, message: "We are number 1"},
        {column: 12, position: 31, message: 0},
        {column: 13, position: 31, message: "Unlucky !@#$%^&*()"},
      ].forEach((t) => {
        assert.equal(parse.getDiagnosticInfo(t).message, t.message);
      });
    });

    test("should have severity of vscode.DiagnosticSeverity.Warning", () => {
      assert.equal(parse.getDiagnosticInfo({column: 42, position: 24}).severity, 1);
    });
  });

  suite(".makeZeroIndex", () => {
    test("should return 0 when value is less than 0", () => {
      assert.equal(parse.makeZeroIndex(0), 0);
    });

    test("should decrement value by 1 when value is greater than 0", () => {
      [
        {value: 0, expected: 0},
        {value: -1, expected: 0},
        {value: -31, expected: 0},
        {value: 2, expected: 1},
        {value: 5, expected: 4},
        {value: 700, expected: 699},
      ].forEach((t) => {
        assert.equal(parse.makeZeroIndex(t.value), t.expected);
      });
    });
  });
});
