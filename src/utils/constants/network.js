const config = {
  url: 'https://dapp.bbtchain.net/apis', //接口前缀
  urlLink: 'https://aceluodan.github.io/web3jAce-front/dist/index.html', //当前钱包地址链接
  contractAddress: '0xCaFB789D00A0E5855F9521d1e589ed437554CaA1', //合约地址
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