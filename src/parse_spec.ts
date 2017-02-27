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
});