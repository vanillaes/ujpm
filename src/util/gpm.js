const GPM = {
  fetchDetails: function() {
    console.log('fetching GitHub package details');
  },

  getVersions: function(package) {
    // npm view @vanillawc/wc-markdown versions --json
  },

  getLatest: function(version) {

    return version;
  },

  filterVersion: function(version) {

  }
}

module.exports = GPM;
