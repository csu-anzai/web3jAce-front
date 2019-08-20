const config = {
  url: 'http://123.108.111.18/apis/aceWeb/operateBtt/',
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