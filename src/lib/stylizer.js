import lemmatizer, {
  REG_FUNCTIONS, REG_SYMBOLS,
} from '@/lib/parser';

// This simply wraps the result as-is in a <span> tag
const wrapInSpans = (classes, innerText) => `<span class="token ${classes.join(' ')}">${innerText}</span>`;

/* This is a little more involved. It adds spaces and applies capitalization
 * to the names of symbols to make things look nice.
 *
 * It uses the capitalization from the symbol definition.
 */
const addSpaces = (_classes, text) => {
  let replacedString = text;
  _classes.map((textClass) => {
    switch (textClass) {
      case 'maths':
      case 'item':
        replacedString = ` ${replacedString} `;
        break;

      case 'punc':
        replacedString = ', ';
        break;

      case 'function':
        REG_FUNCTIONS.forEach(({ search, item }) => {
          replacedString = replacedString.replace(search, `${item.name}(`);
        });
        break;

      case 'symbol':
        REG_SYMBOLS.forEach(({ search, item }) => {
          replacedString = replacedString.replace(search, item.name);
        });
        break;
      default:
        break;
    }

    return null;
  });

  return replacedString;
};

/**
 * A function that generates a styling function given another function that is
 * applied for each token that the lemmatizer tags.
 *
 * @param {Function} func A function in this form: (classes, text) => (some value)
 */
function stylizer(func) {
  let replaceString = '';
  return lemmatizer((s) => {
    replaceString = s;
  },
  (struct, f, tags) => {
    replaceString = replaceString.replace(struct.search, struct.replace(f, tags));
  },
  func,
  () => replaceString);
}

export const reformatString = stylizer(addSpaces);
export const stylizeString = stylizer(wrapInSpans);
