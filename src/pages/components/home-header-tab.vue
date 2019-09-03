<template>
  <main class="home-header-tab">
    <h3>{{ $t("home.title") }}</h3>
    <p>{{ burningNumber }}BBT/ETH</p>

    <section class="ipt-list">
      <input
        type="number"
        placeholder="1 ETH"
        v-model="burningIpt"
        maxlength="20"
      />
      <span>ETH</span>
    </section>

    <ul>
      <li
        v-for="(item, index) in itemList"
        :key="index"
        :class="idx === index ? 'active-bg' : ''"
        @click="tabEth(index, item.val)"
      >
        {{ item.txt }}
      </li>
    </ul>

    <public-btn :txt="sendBtn" :disabled="sendEthDisabled" @click.native="sendFrom" class="active-btn" />

    <section class="ipt-list">
      <input type="number" v-model="burningIptBBT" readonly maxlength="20" />
      <span>BBT</span>
    </section>

    <public-btn
      :txt="sendBtn1"
      @click.native="transferBbt"
      class="active-btn"
      :disabled="sendBbtDisabled"
    />

    <!-- <public-btn :txt="exchangeBtn" @click.native="exchangeFrom" /> -->
  </main>
</template>

<script>
import publicBtn from "../../components/public-btn"
import { log } from 'util';

export default {
  name: 'homeHeaderTab',
  props: {
    currentAddress: String
  },
  components: {
    publicBtn
  },
  data() {
    return {
      burningIpt: '5',
      burningIptBBT: '2500',
      burningNumber: 5000, //燃烧比列
      sendBtn: 'home.sendBtn',
      sendBtn1: 'home.sendBtn1',
      exchangeBtn: 'home.exchangeBtn',
      idx: 0,
      itemList: [
        {
          id: 1,
          val: '5',
          txt: '5 ETH'
        },
        {
          id: 2,
          val: '10',
          txt: '10 ETH'
        },
        {
          id: 3,
          val: '15',
          txt: '15 ETH'
        }
      ],
      sendEthDisabled: false,
      sendBbtDisabled: false,
    }
  },
  created() {
   
  },
  methods: {
    tabEth(index, txt) {
      this.idx = index
      this.burningIpt = txt
    },
    transferBbt() {
      imToken.callAPI('native.showLoading', 'loading...');
      if (window.ethereum) {
        web3 = new Web3(ethereum);
        ethereum.enable();
      }
      else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
      }
      console.log("转账BBT开始")
      console.log("钱包发送地址：" + this.currentAddress)
      console.log("钱包接收地址：" + _const.bbtAddress)
      console.log("转账BBT结束")
      var from = this.currentAddress; //当前钱包地址
      var to = _const.bbtAddress; //接收地址
      //var from = "0x9506dc8197222189C0A85442Ed93A5066209aA50";
      // 定义合约abi
      var contractAbi = [{ "constant": true, "inputs": [], "name": "mintingFinished", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "transfersEnabledFlag", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "cap", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "disableTransfers", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "lockAccounts", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "finishMinting", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_addr", "type": "address" }], "name": "addMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "enableTransfers", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "target", "type": "address" }, { "name": "lock", "type": "bool" }], "name": "lockAccounts", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_addr", "type": "address" }], "name": "deleteMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "minters", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "Mint", "type": "event" }, { "anonymous": false, "inputs": [], "name": "MintFinished", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "target", "type": "address" }, { "indexed": false, "name": "lock", "type": "bool" }], "name": "LockFunds", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }];
      //合约地址
      var contractAddress = "0x7c88c20587d154c631bda1315b1489b852a5d652";
      //var gasPrice = web3.eth.gasPrice;
      var gasPrice = 110000000000;
      var gasLimit = 800000;
      var count = 71;
      console.log("from : " + from);
      var tokenValue = this.burningIptBBT;
      console.log(tokenValue)

      var that = this
      that.sendBbtDisabled = true

      web3.eth.getGasPrice(function (error, price) {
        imToken.callAPI('native.hideLoading')
        that.sendBbtDisabled = false
        if (!error) {
          console.log("gasprice : " + price);
          gasPrice = price;
          web3.eth.getTransactionCount(from, function (error, tcount) {
            if (!error) {
              //imToken.callAPI('native.toastInfo', '转账提交成功')
              console.log("tcount : " + tcount);
              count = tcount;
              //var tokenValue = this.burningIpt*(10**18)*500;
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
              console.log("进入开始转账1")
              console.log(params)
              console.log("进入开始转账2")
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
        } else {
          console.log("error : " + error);
        }
      });
      console.log("gasPrice : " + gasPrice);
      console.log("count : " + count);
    },

    sendFrom() {
      imToken.callAPI('native.showLoading', 'loading...');
      if (window.ethereum) {
        web3 = new Web3(ethereum);
        ethereum.enable();
      }
      else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
      }
      var gasPriceTemp = 110000000000;
      var gasLimitTemp = 800000;
      var ethAmount = this.burningIpt * (10 ** 18)
      var ethAmountIpt = this.burningIpt
      var bbtAmount = this.burningIptBBT
      var currentAddress = this.currentAddress

      console.log("转账ETH开始")
      console.log("钱包发送地址：" + currentAddress)
      console.log("钱包接收地址：" + _const.ethAddress)
      console.log("转账ETH结束")

      var that = this
      that.sendEthDisabled = true

      web3.eth.getGasPrice(function (error, price) {
        that.sendEthDisabled = false
        imToken.callAPI('native.hideLoading')
        if (!error) {
          console.log("gasPriceTemp : " + price);
          gasPriceTemp = price*1.01;
          //调用imToken的转账方法
          var params = {
            from: currentAddress,
            to: _const.ethAddress,
            value: ethAmount,
            //gasLimit: gasLimitTemp,
            gasPrice: gasPriceTemp,
            orderInfo: 'BBT应用转账ETH',
            feeCustomizable: false,
          }
          imToken.callAPI('transaction.tokenPay', params, function (err, hash) {
            if (err) {
              imToken.callAPI('native.toastInfo', err.message)
              console.log(err)
            } else {
              //imToken.callAPI('native.toastInfo', '提交转账成功ETH')
              let tipsTxt = '您已经充值了' + ethAmountIpt + '个ETH，请充值' + bbtAmount + '个BBT！'
              imToken.callAPI('native.confirm', {
                title: '温馨提示',
                message: tipsTxt,
                cancelText: '取消',
                confirmText: '确定'
              }, function (err, result) { })
            }
          })
        } else {
          console.log("error : " + error);
        }
      });

    },

    exchangeFrom() {
      this.$emit('exchange')
    }
  },
  watch: {
    burningIpt(newVal, oldVal) {
      this.burningIptBBT = newVal * 500
    }
  },
}
</script>

<style scoped lang="scss">
@import "../../assets/styless/public";
.home-header-tab {
  width: 8.67rem;
  margin: 0 auto 0.43rem;
  background: #262626;
  text-align: center;
  padding: 0.85rem 0.4rem 0.64rem;
  box-shadow: 0 0.08rem 0.2rem rgba(0,0,0,0.3);
  border-radius: 0.21rem;
  h3 {
    font-size: 0.32rem;
    color: #BFB6A0;
    padding-bottom: 0.27rem;
    font-family: source-Regular;
  }
  p {
    color: #fff;
    font-size: 0.48rem;
    font-family: lato-blod;
  }
  .ipt-list {
    @extend %flexBetween;
    margin: 1.33rem auto 0;
    height: 1.07rem;
    @include border($c: rgba(255,255,255,0.2), $d: bottom);
    box-sizing: border-box;
    input {
      flex: 1;
      border: 0;
      color: #fff;
      height: 1rem;
      line-height: 1rem;
      font-size: 0.48rem;
      background: transparent;
      font-family: lato-blod;
    }
    span {
      width: 1rem;
      height: 1.07rem;
      color: #fff;
      font-size: 0.37rem;
      @extend %flexCenter;
      font-family: lato-Medium;
    }
  }
  ul {
    margin: 1.07rem auto;
    @extend %flexBetween;
    li {
      padding: 0.35rem 0.69rem;
      @include border($c: rgba(250, 250, 250, 0.3), $d: bor, $s: dashed);
      border-radius: 0.05rem;
      font-size: 0.32rem;
      color: #E7C054;
      font-family: lato-blod;
    }
    .active-bg {
      background:rgba(231,192,84,0.1);
      color: #E7C054;
      border: 1px solid #E7C054;
    }
  }
  button:last-child {
    margin-top: 0.27rem;
  }
  .active-btn {
    background: #E7C054;
    border:1px solid rgba(231,192,84,1);
    color: #fff;
  }
}
</style>