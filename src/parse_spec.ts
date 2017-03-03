import * as assert from 'assert';

import * as parse from './parse';
import * as fixtures from '../test/fixtures';

describe('parse', () => {
  describe('.getLines', () => {
    it('should get correct number of lines', () => {
      [
        {output: null, expected: 0},
        {output: '', expected: 0},
        {output: 'three \n new \n lines \n', expected: 4},
        {output: 'one liner \n', expected: 2},
        {output: 'no new line', expected: 1}
      ].forEach(test => {
        let result = parse.getLines(test.output);

        assert.equal(result.length, test.expected);
      });
    });

    it('should get correct number of lines for credo output', () => {
      let result = parse.getLines(fixtures.output.listOneline);

      assert.equal(result.length, 5);
    });
  });

  describe('.getLineInfo', () => {
    let testTree: any = [
          {line: 'nothing to see here', expected: undefined},
          {line: '[R] → lib/rumbl.ex:27:7 Functions should have a @spec type specification.', position: 27, column: 7, message: 'Functions should have a @spec type specification.'},
          {line: '[R] → lib/rumbl.ex:1:11 Modules should have a @moduledoc tag.', position: 1, column: 11, message: 'Modules should have a @moduledoc tag.'},
          {line: '[R] → lib/rumbl.ex:6:10001 Functions should have a @spec type specification.', position: 6, column: 10001, message: 'Functions should have a @spec type specification.'}
        ];

    it('should get expected line column', () => {
      testTree.forEach(t => {
        assert.equal(parse.getLineInfo(t.line).column, t.column);
      });
    });

    it('should get expected position', () => {
      testTree.forEach(t => {
        assert.equal(parse.getLineInfo(t.line).position, t.position);
      });
    });

    it('should get expected message', () => {
      testTree.forEach(t => {
        assert.equal(parse.getLineInfo(t.line).message, t.message);
      });
    });
  });

  describe('.getDiagnosticInfo', () => {
    it('should be undefined if no params', () => {
      assert.equal(parse.getDiagnosticInfo(null), undefined);
    });

    it('should be undefined if position is falsy', () => {
      assert.equal(parse.getDiagnosticInfo({column: 2}), undefined);
    });

    it('should be undefined if column is falsy', () => {
      assert.equal(parse.getDiagnosticInfo({position: 5}), undefined);
    });

    it('should result in startLine <= endLine', () => {
        [
          { column: 1, position: 1 },
          { column: 20, position: 5 },
          { column: 12, position: 101 }
        ].forEach(t => {
          let result = parse.getDiagnosticInfo(t);
          assert.ok(result.startLine <=  result.endLine, `when column ${t.column} and position ${t.position}`);
        });
    });
  });
});