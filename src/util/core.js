export function parse (input) {
  const source = {};

  // extract source.strategy
  let strategy = /^(.*?):/.exec(input)
  input = input.substring(strategy[0].length);
  source.strategy = strategy[1];

  // remove leading @ from scoped packages
  if (input[0] === '@') {
    input = input.substring(1)
    source.scoped = true;
  }
  
  // extract source.owner
  let owner = /^(.*?)\//.exec(input);
  input = input.substring(owner[0].length);
  source.owner = owner[1];

  // return source.name if no version scope
  if (!/@/.test(input)) {
    // set scope.name
    source.name = input;

    // set scope.package
    source.package = `${source.scoped ? '@' : ''}${source.owner}/${source.name}`;

    // set scope.version
    source.version = 'latest';

    return source;
  }

  // extract source.name
  let name = /^(.*?)@/.exec(input);
  input = input.substring(name[0].length);
  source.name = name[1];

  // set scope.package
  source.package = `${source.scoped ? '@' : ''}${source.owner}/${source.name}`;

  // set scope.version
  source.version = input

  return source;
}

export default { parse };
