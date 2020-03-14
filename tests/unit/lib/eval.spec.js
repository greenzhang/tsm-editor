/* eslint-disable import/extensions */
import evaluateString from '@/lib/eval.js';

describe('evaluateString', () => {
  it('evaluates a single variable', () => {
    const text = 'DBMarket';
    expect(evaluateString(text, {
      DBMarket: 100,
    })).toEqual(100);
  });

  it('evaluates the min function between two variables', () => {
    const text = 'min(DBMarket, DBMinBuyout)';
    expect(evaluateString(text, {
      DBMarket: 100,
      DBMinBuyout: 20,
    })).toEqual(20);
  });

  it('evaluates the addition of two variables', () => {
    const text = 'DBMarket + DBMinBuyout';
    expect(evaluateString(text, {
      DBMarket: 100,
      DBMinBuyout: 20,
    })).toEqual(120);
  });
});
