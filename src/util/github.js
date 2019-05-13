const GITHUB = {
  fetchPackage: function() {
    console.log('fetching GitHub repo');
  },

  // https://api.github.com/repos/vanillawc/wc-markdown/tags
  getVersions: function(package) {
  },

  // https://api.github.com/repos/vanillawc/wc-markdown/releases/latest
  getLatest: function(version) {

    return version;
  },

  filterVersion: function(version) {

  }
}

module.exports = GITHUB;
