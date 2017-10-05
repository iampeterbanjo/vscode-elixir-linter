import * as assert from "assert";
import * as sinon from "sinon";
import * as severity from "../src/severity";
import * as vscodeMock from "./vscode_mock";

describe("severity", () => {

  describe(".parse", () => {
    it("should return `1` by default", () => {
      const result = severity.parse("BLAH", vscodeMock);
      assert.equal(result, 1);
    });

    it("should return `defaultSeverity` setting by default if set", () => {
      const testSeverity = 42;
      const mockConfig = vscodeMock.getMockConfiguration({
        defaultSeverity: testSeverity,
      });

      const result = severity.parse("WHAT", vscodeMock);
      assert.equal(result, testSeverity);

      mockConfig.restore();
    });

    it("should return expected severity", () => {
      [
        {check: "C", expected: 1},
        {check: "R", expected: 1},
        {check: "F", expected: 1},
        {check: "D", expected: 1},
        {check: "W", expected: 1},
      ].forEach((t) => {
        const result = severity.parse(t.check, vscodeMock);
        const error = `${result} === ${t.expected} when check is "${t.check}"`;
        assert.equal(result, t.expected);
      });
    });

    it("should return expected default severity for each error from settings", () => {
      const consistencyError = 10;
      const readabilityError = 11;
      const refactoringError = 12;
      const designError = 14;
      const warningsError = 15;

      const mockConfig = vscodeMock.getMockConfiguration();

      [
        {check: "C", expected: consistencyError},
        {check: "R", expected: readabilityError},
        {check: "F", expected: refactoringError},
        {check: "D", expected: designError},
        {check: "W", expected: warningsError},
      ].forEach((t) => {
        const result = severity.parse(t.check, vscodeMock);
        const error = `${result} === ${t.expected} when check is "${t.check}"`;
        assert.equal(result, t.expected);
      });

      mockConfig.restore();
    });
  });
});
