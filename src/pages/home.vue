<template>
  <main class="home">
    <header class="home-header">
      <home-nav />
      <home-header />
    </header>

    <section class="home-container">
      <home-tab @click="openMak" @exchange="maskShow = true" />

      <home-body />

      <section class="btn-list">
        <public-btn :txt="settleBtn" @click.native="test" />

        <input
          type="number"
          :placeholder="$t('home.amountIpt')"
          v-model="withdrawIpt"
          maxlength="42"
        />
        <public-btn :txt="withdrawBtn" @click.native="withdrawal" />

        <input
          type="text"
          :placeholder="$t('home.addressIpt')"
          v-model="invitationIpt"
          maxlength="42"
        />
        <input type="text" v-model="userAddress" class="user-address-ipt" />
        <public-btn :txt="invitationBtn" @click.native="invitation" />
      </section>
    </section>

    <home-mask v-show="maskShow" @close="closeMask" />

    <public-toast v-show="toastShow" :txt="toastTxt" />
  </main>
</template>

<script>
import '../utils/homeBgCanvas.js'
import homeNav from './components/home-nav'
import publicBtn from '../components/public-btn'
import homeHeader from './components/home-header'
import homeBody from './components/home-body'
import homeMask from './components/home-mask'
import publicToast from '../components/public-toast'

import homeTab from "./components/home-header-tab";

export default {
  name: 'home',
  components: {
    homeNav,
    homeHeader,
    homeBody,
    publicBtn,
    homeMask,
    homeTab,
    publicToast
  },
  props: {},
  data() {
    return {
      settleBtn: 'home.settleBtn',
      withdrawBtn: 'home.withdrawBtn',
      invitationBtn: 'home.invitationBtn',
      maskShow: false,
      invitationIpt: '', //被邀请人地址
      withdrawIpt: '', //提现金额
      toastShow: false,
      toastTxt: '',

      userAddress: ''
    }
  },
  computed: {

  },
  created() {
    this.test()
    // let that = this
    // imToken.callAPI('user.getCurrentAccount', function (err, address) {
    //   if (err) {
    //     imToken.callAPI('native.toastInfo', '获取钱包信息失败，请稍后重试')
    //   } else {
    //     that.userAddress = address
    //     this.$axios.post(_const.url + "/aceWeb/operateBtt/operateAccount", this.qs.stringify({ "address": '0x09ced3ca4a35a636e5e190a1608e4b0299109e8' })).then(res => {
    //       let data = res.data.data
    //       console.log(data)
    //       if (data === "" || data === null || code === 400) {
    //         that.withdrawIpt = 0 //可提现余额
    //         imToken.callAPI('native.toastInfo', '用户不存在或者其他错误')
    //       } else {
    //         console.log(data.receiveAmountEth - data.withdrawAmountEth)
    //         that.withdrawIpt = (data.receiveAmountEth - data.withdrawAmountEth) || 0 //可提现余额
    //       }
    //     }).catch(error => {
    //       console.log("获取用户信息错误")
    //       console.log(error);
    //     });
    //   }
    // })
  },
  mounted() {
    document.getElementsByTagName('canvas')[0].style.visibility = "visible"
  },
  destroyed() {
    document.getElementsByTagName('canvas')[0].style.visibility = "hidden"

  },
  methods: {
    settle() {
      this.$router.push({ path: '/withdraw' })
    },

    openMak() {
      this.maskShow = true
    },

    closeMask() {
      this.maskShow = false
    },

    //复制
    invitation() {
      let address2 = this.invitationIpt.replace(/\s+/g, "")
      let parm = {
        "address": this.userAddress,
        "refAddress": address2
      }
      console.log(parm);
      //var address1 = "0x09ced3ca4a35a636e5e190a1608e4b0299109e8"

      this.$axios.post(_const.url + "/aceWeb/operateBtt/operateAccount", this.qs.stringify(parm)).then(res => {
        let data = res.data
        let code = data.statusCode
        if (code == 200) {
          imToken.callAPI('native.setClipboard', _const.urlLink + '/?address=' + address2)
          imToken.callAPI('native.toastInfo', '复制成功')
          //alert("成功")
        } else {
          imToken.callAPI('native.toastInfo', '复制失败：' + data.statusMsg)
          this.invitationIpt = ""
          //alert('复制失败：' + data.statusMsg)
        }
      }).catch(error => {
        console.log(error)
        imToken.callAPI('native.toastInfo', '系统错误，请稍后重试...')
        //alert("系统错误，请稍后重试")
      });
    },

    //提现
    withdrawal() {
      let ipt = this.withdrawIpt.replace(/\s+/g, "")
      var walletAddress = this.userAddress
      if (ipt === "" || ipt === 0 || ipt < 0) {
        imToken.callAPI('native.toastInfo', '请输入正确的提现金额')
        return
      }
      const parm = {
        "address": walletAddress, //提现地址
        "amount": ipt //提现数额 字符串，单位：eth
      }
      this.$axios.post(_const.url + '/aceWeb/operateBtt/withdraw', this.qs.stringify(parm)).then(res => {
        let data = res.data
        let code = data.statusCode
        if (code == 200) {
          imToken.callAPI('native.toastInfo', '提现成功')
          //alert("提现成功")
        } else {
          imToken.callAPI('native.toastInfo', '提现失败：' + data.statusMsg)
          //alert("提现失败：" + data.statusMsg)
        }
      }).catch(error => {
        imToken.callAPI('native.toastInfo', '系统错误，请稍后重试...')
        console.log(error)
        //alert("系统错误，请稍后重试")
      });
    },

    test() {
      var from = "0x1b1755dbc38b13261BEAd045a7b435bB23D198A3";
      // //var web3 = require("web3"); //引入web3支持，我本地使用的是web3^0.18.4
      //var fs = require("fs"); //文件读写
      var Tx = require("ethereumjs-tx"); //引入以太坊js交易支持


      if (typeof web3 !== 'undefined') {
        console.log("进入1")
        //web3 = new Web3(web3.currentProvider);
        web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet-eth.token.im"));
      } else {
        console.log("进入2")
        web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet-eth.token.im"));
      }
      var to = "0x4094D51860B0B6478fe635A661951F3318C6B62e";


      // 定义合约abi
      var contractAbi = [{ "constant": true, "inputs": [], "name": "mintingFinished", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "transfersEnabledFlag", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "cap", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "disableTransfers", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "lockAccounts", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "finishMinting", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_addr", "type": "address" }], "name": "addMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "enableTransfers", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "target", "type": "address" }, { "name": "lock", "type": "bool" }], "name": "lockAccounts", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_addr", "type": "address" }], "name": "deleteMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "minters", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "Mint", "type": "event" }, { "anonymous": false, "inputs": [], "name": "MintFinished", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "target", "type": "address" }, { "indexed": false, "name": "lock", "type": "bool" }], "name": "LockFunds", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }];

      //var contractAbi = JSON.parse(fs.readFileSync('./utils/MarmotTokenAbi_web3^0.18.4.txt', 'utf-8'))

      //合约地址
      var contractAddress = "0x7c88c20587d154c631bda1315b1489b852a5d652";
      //console.log(web3);
      var gasPrice = web3.eth.gasPrice;
      var gasLimit = 90000;
      // 从Imtoken 获取 from 当前账户


      var count = web3.eth.getTransactionCount(from);
      var tokenValue = 1;
      var MMTContract = web3.eth.contract(contractAbi).at(contractAddress)
      var decimal = MMTContract.decimals();
      var balance = MMTContract.balanceOf(from);

      //var adjustedBalance = balance / Math.pow(10, decimal)
      // var tokenName = MMTContract.name();
      // var tokenSymbol = MMTContract.symbol();
      // console.info("tokenSymbol: " + tokenSymbol);
      // console.info("tokenName: " + tokenName);
      //alert("adjustedBalance: " + adjustedBalance);
      // console.info("decimal: " + decimal);

      //实例交易
      //var tx = new Tx(rawTransaction);

      //imtoken 接口去签名 todo
      //签名
      var params = {
        "from": from,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": contractAddress,
        "value": "0x0",
        "data": MMTContract.transfer.getData(to, tokenValue * (10 ** decimal))
      }
      alert("开始签名")

      imToken.callAPI('transaction.signTransaction', params, function (err, hashs) {
        if (err) {
          alert(err)
        } else {
          //发送交易，留下hash
          //var serializedTx = hashs.serialize();
          console.log(hashs);
          // web3.eth.sendRawTransaction(hashs, function (err, hash) {
          //   if (!err) {
          //     alert("成功");
          //     console.log(hash);
          //   } else {
          //     alert(err);
          //     console.log(err)
          //   }
          // });

          imToken.callAPI('transaction.sendTransaction', hashs, function (err, hash) {
            if (!err) {
              alert("成功");
              console.log(hash);
            } else {
              alert(err);
              console.log(err)
            }
        });

    }
  })



}
  }
}
</script>

<style scoped lang="scss">
@import "../assets/styless/public";
.home {
  background: #ebecf0;
  padding-bottom: 0.35rem;
  .home-header {
    height: 8.68rem;
  }
  .home-container {
    width: 9.47rem;
    border-radius: 0.21rem 0.21rem 0 0;
    margin: 0 auto;
    margin-top: -1.5rem;
    z-index: 4;
    position: relative;
  }
  .btn-list {
    @extend %flexCenter;
    flex-direction: column;
    background: #fff;
    padding: 0.29rem 0 0.75rem;
    border-radius: 0 0 0.21rem 0.21rem;
    button {
      width: 8.67rem;
      margin-top: 0.27rem;
      &:first-child {
        margin-top: 0;
      }
    }
    input {
      width: 8.67rem;
      margin-top: 0.27rem;
      padding: 0.35rem 0;
      border: 0;
      @include border($d: bottom);
      border-radius: 0;
    }
    .user-address-ipt {
      opacity: 0;
      height: 0;
      padding: 0;
      margin: 0;
    }
  }
}
</style>