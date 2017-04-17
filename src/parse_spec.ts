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
      [
        {column: 3, position:  0},
        {column: 66, position: undefined},
        {column: 34, position: null},
        {column: 2, position:  false},
        {column: 21, position: ''}
      ].forEach(t => {
        assert.equal(parse.getDiagnosticInfo(t), undefined);
      });
    });

    it('should be undefined if column is falsy', () => {
      [
        {position: 5, column: 0},
        {position: 6, column: undefined},
        {position: 90, column: null},
        {position: 25, column: false},
        {position: 65, column: ''}
      ].forEach(t => {
        assert.equal(parse.getDiagnosticInfo(t), undefined);
      });
    });

    it('should be undefined if column is less than 1', () => {
      assert.equal(parse.getDiagnosticInfo({column: -1}), undefined);
    });

    it('should be undefined if position is less than 1', () => {
      assert.equal(parse.getDiagnosticInfo({position: -20}), undefined);
    });

    it('should NOT be undefined if column and position are 1', () => {
      assert.ok(parse.getDiagnosticInfo({column: 1, position: 1}) !== undefined);
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

    it('should result in startColumn <= endColumn', () => {
        [
          { column: 1, position: 1 },
          { column: 20, position: 5 },
          { column: 12, position: 101 }
        ].forEach(t => {
          let result = parse.getDiagnosticInfo(t);
          assert.ok(result.startColumn <=  result.endColumn, `when column ${t.column} and position ${t.position}`);
        });
    });

    it('should have the expected message', () => {
      [
        {column: 1, position: 1, message: 'We are number 1'},
        {column: 12, position: 31, message: 0},
        {column: 13, position: 31, message: 'Unlucky !@#$%^&*()'}
      ].forEach(t => {
        assert.equal(parse.getDiagnosticInfo(t).message, t.message);
      });
    })

    it('should have severity of vscode.DiagnosticSeverity.Warning', () => {
      assert.equal(parse.getDiagnosticInfo({column: 42, position: 24}).severity, 1);
    });
  });

  describe('.makeZeroIndex', () => {
    it('should return 0 when value is less than 0', () => {
      assert.equal(parse.makeZeroIndex(0), 0);
    });

    it('should decrement value by 1 when value is greater than 0', () => {
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
  })
});
