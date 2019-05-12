const NPM = {
  fetchPackage: function() {
    console.log('fetching NPM package');
  },

  // npm view @vanillawc/wc-markdown versions --json
  getVersions: function(package) {
  },

  // npm view @vanillawc/wc-markdown --json
  getLatest: function(version) {

    return version;
  },

  filterVersion: function(version) {

  }
}

module.exports = NPM;