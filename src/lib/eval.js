import lemmatizer from '@/lib/parser';

/**
 * Returns an eval() function for TSM Price Strings.
 */
function makeEvaluator() {
  let replaceString = '';
  const grammar = {};
  const xmltreemaker = lemmatizer((s) => {
    replaceString = s;
  },
  (struct, f) => {
    if (struct.item === null) {
      return;
    }
    replaceString = replaceString.replace(struct.search, struct.replace(f, [struct.item.name]));
    if (struct.item) {
      grammar[struct.item.name] = struct.item;
    }
  },
  (classes, innerText) => `<t c="${classes.join(' ')}">${innerText}</t>`,
  () => replaceString);

  return {
    xmltreemaker,
    grammar,
  };
}

function parseNode(node, grammar) {
  const tokenName = node.getAttribute('c');

  if (grammar[tokenName]) {
    const item = grammar[tokenName];
    const childFunctions = [];

    for (let i = 0; i < node.children.length; i += 1) {
      childFunctions.push(parseNode(node.children[i], grammar));
    }

    return item.makeEvaluator(childFunctions);
  }

  return null;
}

export default function evaluateString(string, data) {
  const { xmltreemaker, grammar } = makeEvaluator();
  const xml = xmltreemaker(string);
  const doc = new DOMParser().parseFromString(xml, 'text/xml');

  const evaluator = parseNode(doc.firstElementChild, grammar);

  return evaluator(data);
}
