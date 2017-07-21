import * as assert from "assert";

import * as parse from "../src/parse";
import * as fixtures from "../test/fixtures";

describe("parse", () => {
  describe(".getLines", () => {
    it("should get correct number of lines", () => {
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

    it("should get correct number of lines for credo output", () => {
      const result = parse.getLines(fixtures.output.listOneline);

      assert.equal(result.length, 6);
    });
  });

  describe(".getFileInfo", () => {
    it("should return an empty string by default", () => {
      assert.equal(parse.getFileInfo(""), "");
    });

    it("should return expected item from file information", () => {
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

  describe(".getLineInfoCheck", () => {
    it("should get expected check", () => {
      fixtures.output.testTree.forEach((t) => {
        const result = parse.getLineInfoCheck({}, t.line).check;
        const error = `${result} === ${t.expected.check} when line is "${t.line}"`;
        assert.equal(result, t.expected.check, error);
      });
    });
  });

  describe(".getLineInfoColumn", () => {
    it("should get expected line column", () => {
      fixtures.output.testTree.forEach((t) => {
        const result = parse.getLineInfoColumn({}, t.line).column;
        const error = `${result} === ${t.expected.column} when line is "${t.line}"`;
        assert.equal(result, t.expected.column, error);
      });
    });
  });

  describe(".getLineInfoMessage", () => {
    it("should get expected message", () => {
      fixtures.output.testTree.forEach((t) => {
        const result = parse.getLineInfoMessage({}, t.line).message;
        const error = `${result} === ${t.expected.message} when line is "${t.line}"`;
        assert.equal(result, t.expected.message, error);
      });
    });
  });

  describe(".getLineInfoPosition", () => {
    it("should get expected position", () => {
      fixtures.output.testTree.forEach((t) => {
        const result = parse.getLineInfoPosition({}, t.line).position;
        const error = `${result} === ${t.expected.position} when line is "${t.line}"`;
        assert.equal(result, t.expected.position, error);
      });
    });
  });

  describe(".getLineInfo", () => {
    it("should get expected info", () => {
      fixtures.output.testTree.forEach((t) => {
        const result = parse.getLineInfo(t.line);
        const error = `${result} === ${t.expected} when line is "${t.line}"`;
        assert.deepEqual(result, t.expected, error);
      });
    });
  });
});
