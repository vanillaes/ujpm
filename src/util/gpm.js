const GPM = {
  fetchPackage: function() {
    console.log('fetching GitHub package');
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
