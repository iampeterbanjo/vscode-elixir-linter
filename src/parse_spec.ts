import * as assert from 'assert';

import * as parse from './parse';
import * as fixtures from '../test/fixtures';

describe('parse', () => {
  describe('.getLines', () => {
    it('should get correct number of lines', () => {
      [
        {output: '', expected: 1},
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

  describe('.getColumn', () => {
    it('should get expected line column', () => {
      [
        {line: 'nothing to see here', expected: undefined},
        {line: '[R] → lib/rumbl.ex:27:7 Functions should have a @spec type specification.', expected: 7},
        {line: '[R] → lib/rumbl.ex:1:11 Modules should have a @moduledoc tag.', expected: 11},
        {line: '[R] → lib/rumbl.ex:6:1 Functions should have a @spec type specification.', expected: 1}
      ].forEach(t => {
        assert.equal(parse.getColumn(t.line), t.expected);
      });
    });
  });
});