import { symbols, functions } from '@/lib/definitions';

const searchReplace = (search, replace, item) => ({
  search,
  replace: (f, tags) => (replace ? f(tags, replace) : ((_, p1) => f(tags, p1))),
  item: item || null,
});

export const REG_GOLD = searchReplace(/(\d+g)/g);
export const REG_SILVER = searchReplace(/(\d+s)/g);
export const REG_COPPER = searchReplace(/(\d+c)/g);

export const REG_LPAREN = searchReplace(/\(/g, '(');
export const REG_RPAREN = searchReplace(/\)/g, ')');

export const REG_MATH_REPLACEMENTS = [
  searchReplace(/\//g, '/'),
  searchReplace(/-/g, '-'),
  searchReplace(/\*/g, '*'),
  searchReplace(/\+/g, '+'),
];

export const REG_PERCENT_REPLACEMENTS = [
  searchReplace(/%/g, '%'),
];

export const REG_PUNCTUATION = searchReplace(/(,)/g);
export const REG_NUMERIC = searchReplace(/(\d+\.?\d{0,}|\.?\d+)/g);

export const REG_ITEMS = [
  searchReplace(/(\[.+\])/g),
  searchReplace(/(i:(\d+|ID))/g),
  searchReplace(/(item:(\d+|ID))/g),
];

export const REG_FUNCTIONS = functions.map(f => searchReplace(new RegExp(`(${f.name}\\s?\\()`, 'gi'), null, f));

export const REG_SYMBOLS = symbols.map(s => searchReplace(new RegExp(`(${s.name})`, 'gi'), null, s));

/**
 * Returns a function that takes a string argument and parses it using known
 * grammar rules defined in this file.
 *
 * The functions passed defined each step of the process, from walking through each
 * grammar rule (the walker function), to tagging the found patterns along the way (the
 * tagger function). It returns a string, defined by the end function.
 *
 * @param {Function} start Function in the form of (String)
 * @param {Function} walker Function in the form of (RegExp|Array, Function, Array)
 * @param {Function} tagger Function in the form of (Array, String) => String
 * @param {Function} end Function in the form of (String) => String
 */
export default function lemmatizer(start, walker, tagger, end) {
  return (string) => {
    start(string);

    REG_MATH_REPLACEMENTS.forEach((n) => {
      walker(n, tagger, ['maths']);
    });

    REG_PERCENT_REPLACEMENTS.forEach((n) => {
      walker(n, tagger, ['percent']);
    });

    REG_ITEMS.forEach((regex) => {
      walker(regex, tagger, ['item']);
    });

    REG_FUNCTIONS.forEach((regex) => {
      walker(regex, tagger, ['function']);
    });

    REG_SYMBOLS.forEach((regex) => {
      walker(regex, tagger, ['symbol']);
    });

    walker(REG_LPAREN, tagger, ['parens', 'lparen']);
    walker(REG_RPAREN, tagger, ['parens', 'rparen']);

    walker(REG_GOLD, tagger, ['currency', 'gold']);
    walker(REG_SILVER, tagger, ['currency', 'silver']);
    walker(REG_COPPER, tagger, ['currency', 'copper']);

    walker(REG_PUNCTUATION, tagger, ['punc']);
    walker(REG_NUMERIC, tagger, ['numeric']);

    return end(string);
  };
}
