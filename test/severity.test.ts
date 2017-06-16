import * as assert from "assert";
import * as sinon from "sinon";

import * as severity from "../src/severity";

import * as vscode from "vscode";

suite("severity", () => {

  suite(".parse", () => {
    test("should return `1` by default", () => {
      const result = severity.parse("BLAH");
      assert.equal(result, 1);
    });

    test("should return `defaultSeverity` setting by default if set", () => {
      const testSeverity = 42;
      const mockSettings = sinon.stub(vscode.workspace, "getConfiguration").callsFake(() => {
        return {
          defaultSeverity: testSeverity,
        };
      });

      const result = severity.parse("WHAT");
      assert.equal(result, testSeverity);

      mockSettings.restore();
    });

    test("should return expected severity", () => {
      [
        {check: "C", expected: 2},
        {check: "R", expected: 2},
        {check: "F", expected: 3},
        {check: "D", expected: 3},
        {check: "W", expected: 1},
      ].forEach((t) => {
        const result = severity.parse(t.check);
        const error = `${result} === ${t.expected} when check is "${t.check}"`;
        assert.equal(result, t.expected);
      });
    });

    test("should return expected default severity for each error from settings", () => {
      const consistencyError = 10;
      const readabilityError = 11;
      const refactoringError = 12;
      const designError = 14;
      const warningsError = 15;

      const mockSettings = sinon.stub(vscode.workspace, "getConfiguration").callsFake(() => {
          return {
            consistencySeverity: consistencyError,
            designSeverity: designError,
            readabilitySeverity: readabilityError,
            refactoringSeverity: refactoringError,
            warningsSeverity: warningsError,
          };
        });

      [
        {check: "C", expected: consistencyError},
        {check: "R", expected: readabilityError},
        {check: "F", expected: refactoringError},
        {check: "D", expected: designError},
        {check: "W", expected: warningsError},
      ].forEach((t) => {
        const result = severity.parse(t.check);
        const error = `${result} === ${t.expected} when check is "${t.check}"`;
        assert.equal(result, t.expected);
      });

      mockSettings.restore();
    });
  });
});
