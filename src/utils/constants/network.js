const config = {
  url: 'https://dapp.bbtchain.net/apis',
  urlLink: 'https://aceluodan.github.io/web3jAce-front/dist/index.html',
}

let bindToGlobal = (obj, key) => {
  if (typeof window[key] === 'undefined') {
    window[key] = {};
  }

  for (let i in obj) {
    window[key][i] = obj[i]
  }
}
bindToGlobal(config, '_const')