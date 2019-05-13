const PARSE = {
  input: function(input) {
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
      source.name = input;
      source.version = 'latest';
      return source;
    }

    // extract source.name
    let name = /^(.*?)@/.exec(input);
    input = input.substring(name[0].length);
    source.name = name[1];

    // parse the version
    source.version = input

    return source;
  }
};

module.exports = PARSE;
