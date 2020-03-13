import lemmatizer from '@/lib/parser';

/**
 * Returns an eval() function for TSM Price Strings.
 */
function makeEvaluator() {
  const start = () => 'foo';
  const walk = () => 'bar';
  const tag = () => 'quux';
  const end = () => 'baz';

  return lemmatizer(start, walk, tag, end);
}

const evaluateString = makeEvaluator();

export default evaluateString;
