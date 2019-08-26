<template>
  <main class="home">
    <section v-if="phomePage === 0">
      <header class="home-header">
        <home-nav />
        <home-header />
      </header>

      <section class="home-container">
        <home-tab @click="openMak" @exchange="maskShow = true" />

        <home-body />

        <section class="btn-list">
          <public-btn :txt="settleBtn" @click.native="settle" />
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
          <public-btn :txt="invitationBtn" @click.native="invitation" />
        </section>
      </section>

      <home-mask v-show="maskShow" @close="closeMask" />

      <public-toast v-show="toastShow" :txt="toastTxt" />
    </section>

    <section class="imToken-content" v-if="phomePage === 1">
      {{ $t('home.homeTips') }}
    </section>
  </main>
</template>

<script>
import homeNav from './components/home-nav'
import publicBtn from '../components/public-btn'
import homeHeader from './components/home-header'
import homeBody from './components/home-body'
import homeMask from './components/home-mask'
import publicToast from '../components/public-toast'

import homeTab from "./components/home-header-tab";
import '../utils/homeBgCanvas.js'

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

      currentAddress: '',
      phomePage: 1
    }
  },
  computed: {

  },
  created() {
    this.currentAddress = sessionStorage.getItem("walletAddress")
    this.transferBbt()  //转账 BBT
  },
  mounted() {
    this.getInfoAll()
    /**
     * 判断是否是 imToken 环境
     */
    let flg = !!window.imToken
    if (!flg) {
      this.phomePage = 1
    } else {
      this.phomePage = 0
    }
    if (this.phomePage === 1) {
      document.getElementsByTagName('canvas')[0].style.visibility = "hidden"
    } else {
      document.getElementsByTagName('canvas')[0].style.visibility = "visible"
    }
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
        "address": this.currentAddress,
        "refAddress": address2
      }
      console.log(parm)
      this.$axios.post(_const.url + "/aceWeb/operateBtt/operateAccount", this.qs.stringify(parm)).then(res => {
        let data = res.data
        let code = data.statusCode
        if (code == 200) {
          if (address2 === "") {
            imToken.callAPI('native.setClipboard', _const.urlLink + '/?address=' + this.currentAddress)
          } else {
            imToken.callAPI('native.setClipboard', _const.urlLink + '/?address=' + this.currentAddress + '/?refAddress=' + address2)
          }
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

    //获取钱包信息
    getInfoAll() {
      let data = this.getInfo(sessionStorage.getItem("walletAddress"))
      if (data === "" || data === null) {
        this.withdrawIpt = 0 //可提现余额
        imToken.callAPI('native.toastInfo', '用户不存在或者其他错误')
      } else {
        this.withdrawIpt = this.cal.accSub((data.receiveAmountEth || 0), (data.withdrawAmountEth || 0)) //可提现余额
      }
    },

    //提现
    withdrawal() {
      let ipt = this.withdrawIpt.replace(/\s+/g, "")
      if (ipt < 0 || ipt === 0) {
        imToken.callAPI('native.toastInfo', '请输入正确的提现金额')
        return
      }
      const parm = {
        "address": this.currentAddress, //提现地址
        "amount": ipt //提现数额 字符串，单位：eth
      }
      console.log(parm)
      imToken.callAPI('native.showLoading', 'loading...');
      this.$axios.post(_const.url + '/aceWeb/operateBtt/withdraw', this.qs.stringify(parm)).then(res => {
        imToken.callAPI('native.hideLoading')
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
        imToken.callAPI('native.hideLoading')
        imToken.callAPI('native.toastInfo', '系统错误，请稍后重试...')
        console.log(error)
        //alert("系统错误，请稍后重试")
      });
    },

    transferBbt() {
      if (window.ethereum) {
        web3 = new Web3(ethereum);
        ethereum.enable();
      }
      else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
      }
      var from = this.currentAddress; //当前钱包地址
      var to = "0x4094D51860B0B6478fe635A661951F3318C6B62e"; //接收地址
      //var from = "0x9506dc8197222189C0A85442Ed93A5066209aA50";

      // 定义合约abi
      var contractAbi = [{ "constant": true, "inputs": [], "name": "mintingFinished", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "transfersEnabledFlag", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "cap", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "disableTransfers", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "lockAccounts", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "finishMinting", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_addr", "type": "address" }], "name": "addMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "enableTransfers", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "target", "type": "address" }, { "name": "lock", "type": "bool" }], "name": "lockAccounts", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_addr", "type": "address" }], "name": "deleteMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "minters", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "Mint", "type": "event" }, { "anonymous": false, "inputs": [], "name": "MintFinished", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "target", "type": "address" }, { "indexed": false, "name": "lock", "type": "bool" }], "name": "LockFunds", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }];

      //合约地址
      var contractAddress = "0x7c88c20587d154c631bda1315b1489b852a5d652";

      //var gasPrice = web3.eth.gasPrice;
      var gasPrice = 110000000000;
      var gasLimit = 800000;
      var count = 71;
      console.log("from : "+from);


      web3.eth.getGasPrice(function (error, price){
         
          if (!error) {

          console.log("gasprice : "+price);

          gasPrice = price;

        web3.eth.getTransactionCount(from,function (error, tcount) {
        if (!error) {
          //imToken.callAPI('native.toastInfo', '转账提交成功')
          console.log("tcount : "+tcount);
          count = tcount;

          var tokenValue = 99;
          var MMTContract = web3.eth.contract(contractAbi).at(contractAddress);
          var decimal = 18;

          //var balance = MMTContract.balanceOf(from);
          //var adjustedBalance = balance / Math.pow(10, decimal)
          // var tokenName = MMTContract.name();
          // var tokenSymbol = MMTContract.symbol();
          // console.info("tokenSymbol: " + tokenSymbol);
          // console.info("tokenName: " + tokenName);
          //alert("adjustedBalance: " + adjustedBalance);
          // console.info("decimal: " + decimal);

          //签名
          var params = {
            "from": from,
            "nonce": web3.toHex(tcount),
            "gasPrice": web3.toHex(gasPrice),
            "to": contractAddress,
            "value": "0x0",
            "data": MMTContract.transfer.getData(to, tokenValue * (10 ** decimal))
            //"data": MMTContract.methods.transfer(to, tokenValue * (10 ** decimal)).encodeABI()
          }

          web3.eth.sendTransaction(params, function (error, hash) {
            if (!error) {
              imToken.callAPI('native.toastInfo', '转账提交成功')
              console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
            } else {
              imToken.callAPI('native.toastInfo', error.message)
              console.log(error);
            }
          });


           
        } else {
          console.log(error);
        }
      });


          }else{

           console.log("error : "+error);

          }

      });

      console.log("gasPrice : "+gasPrice);






      console.log("count : "+count);
      
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
  }
  .imToken-content {
    background: #ebecf0;
    height: calc(100vh - .35rem);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>