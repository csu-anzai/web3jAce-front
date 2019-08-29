const config = {
  url: 'https://dapp.bbtchain.net/apis', //接口前缀
  urlLink: 'https://aceluodan.github.io/web3jAce-front/dist/index.html', //当前钱包地址链接
  contractAddress: '0xCaFB789D00A0E5855F9521d1e589ed437554CaA1', //合约地址

  bbtAddress: '0x9506dc8197222189C0A85442Ed93A5066209aA50', //BBT收款地址
  ethAddress: '0xb0d91a9e2ca9b3555769df828e46e1f6b01733ff', //ETH收款地址

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