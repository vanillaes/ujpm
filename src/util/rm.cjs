const rimraf = require('rimraf');
let { promisify } = require('util')
const rimrafAsync = promisify(rimraf);

const RM = {

  rf: async (target) => {
    try {
      await rimrafAsync(target);
    } catch {
      throw Error(`ERR_REMOVE: Failed to delete the package directory`);
    }
  }

}

module.exports = RM;
