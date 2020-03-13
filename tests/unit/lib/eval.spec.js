/* eslint-disable import/extensions */
import evaluateString from '@/lib/eval.js';

describe('evaluateString', () => {
  it('parses a string into a JSON object', () => {
    const text = 'DBMarket';
    expect(evaluateString(text, {
      DBMarket: 100,
    })).toEqual(100);
  });
});
