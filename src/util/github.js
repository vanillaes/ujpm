function fetchDetails () {
  console.log('fetching GitHub repo details');
}

// https://api.github.com/repos/vanillawc/wc-markdown/tags
function getVersions (pack) {
}

// https://api.github.com/repos/vanillawc/wc-markdown/releases/latest
function getLatest (version) {

  return version;
}

function filterVersion (version) {

}

export default { fetchDetails, getVersions, getLatest, filterVersion };
