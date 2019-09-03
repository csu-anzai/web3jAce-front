<template>
  <main class="home">
    <header class="home-header">
      <home-nav />
      <home-header />
    </header>

    <section class="home-container">
      <home-tab
        @click="openMak"
        @exchange="maskShow = true"
        :currentAddress="currentAddress"
      />

      <home-body :currentInfo="currentInfo" />

      <section class="btn-list">
        <router-link to="withdraw" tag="p" class="withdraw-link">{{ $t(settleBtn) }}</router-link>

        <section class="ipt-list">
          <input
            type="number"
            :placeholder="$t('home.amountIpt')"
            v-model="withdrawIpt"
            maxlength="42"
          />
          <img src="../assets/image/tips.png" alt="" @click="openTipsMask">
        </section>
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

    <home-mask v-show="maskShow" @close="closeMask" :maskPage="maskPage" />

    <public-toast v-show="toastShow" :txt="toastTxt" />
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
      maskPage: 1,
      invitationIpt: '', //被邀请人地址
      withdrawIpt: '', //提现金额
      toastShow: false,
      toastTxt: '',

      currentAddress: '',
      currentInfo: []
    }
  },
  computed: {

  },
  created() {
    document.getElementsByTagName('canvas')[0].style.visibility = "visible"
  },
  mounted() {
    // 判断是否授权
    let address = this.$route.query.walletAddress
    console.log("当前钱包地址：" + address)
    this.currentAddress = address
    if (address === "" || address === null) {
      let tipsTxt = '获取钱包信息失败，请重新获取！'
      imToken.callAPI('native.confirm', {
        title: '温馨提示',
        message: tipsTxt,
        cancelText: '取消',
        confirmText: '确定'
      }, function (err, result) {
        this.$router.push({ path: '/' })
      })
    } else {
      this.getInfoAll()
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
      this.maskPage = 0
    },


    openTipsMask () {
      this.maskShow = true
      this.maskPage = 1
    },

    closeMask() {
      this.maskShow = false
    },

    //复制
    invitation() {
      imToken.callAPI('native.setClipboard', _const.urlLink + '/?address=' + this.currentAddress)
      imToken.callAPI('native.toastInfo', '复制成功')
    },

    //获取钱包信息
    getInfoAll() {
      var that = this
      that.$axios.get(_const.url + "/aceWeb/operateBtt/getAccount?address=" + this.$route.query.walletAddress).then(res => {
        let data = res.data.data
        that.currentInfo = data
        if (data === "" || data === null) {
          that.withdrawIpt = 0 //可提现余额
          imToken.callAPI('native.toastInfo', '用户不存在或者其他错误')
        } else {
          that.withdrawIpt = that.cal.accSub((data.receiveAmountEth || 0), (data.withdrawAmountEth || 0)) //可提现余额
        }
        console.log("初始化获取数据");
        console.log(data)
        let flg1 = data.rechargeAmountEth > 0 && data.rechargeAmountEth * 500 < data.rechargeAmountBbt
        let flg2 = data.rechargeAmountEth > 0 && (data.rechargeAmountBbt === 0 || data.rechargeAmountBbt === null)
        console.log("进入判断是否激活开始");
        console.log(flg1)
        console.log(flg2)
        console.log("进入判断是否激活结束");
        let tipsTxt = '您已经充值了' + data.rechargeAmountEth + '个ETH，请充值' + data.rechargeAmountEth * 500 + '个BBT！'
        if (flg1 || flg2) {
          // rechargeAmountEth 
          imToken.callAPI('native.confirm', {
            title: '温馨提示',
            message: tipsTxt,
            cancelText: '取消',
            confirmText: '确定'
          }, function (err, result) { })
        }
      }).catch(error => {
        imToken.callAPI('native.toastInfo', '系统错误，请稍后重试...')
        console.log(error);
      });
    },

    //提现
    withdrawal() {
      let ipt = this.withdrawIpt
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
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/styless/public";
.home {
  background: #161616;
  padding-bottom: 0.35rem;
  .home-header {
    height: 8.68rem;
    //width: 10rem;
    //@include bgCover("https://dapp.bbtchain.net/images/banner.jpg");
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
    background: #262626;
    padding: 0.29rem 0 0.75rem;
    border-radius: 0 0 0.21rem 0.21rem;
    button {
      width: 8.67rem;
      margin-top: 0.27rem;
      &:first-child {
        margin-top: 0;
      }
    }
    .withdraw-link {
      width: 8.67rem;
      height: 1.28rem;
      border-radius: .21rem;
      background: #fff;
      font-size: .37rem;
      box-sizing: border-box;
      @extend %flexCenter;
      @include border($c: rgba(255,255,255,.3),$d: bor);
      color: #E7C054;
      background: #262626;
      font-family: source-Regular;
    }
    input {
      width: 8.67rem;
      margin-top: 0.27rem;
      height: 1rem;
      line-height: 1rem;
      border: 0;
      @include border($d: bottom, $c: rgba(250, 250, 250, 0.3));
      border-radius: 0;
      background: transparent;
      color: #fff;
    }
    .ipt-list {
      @include border($d: bottom, $c: rgba(250, 250, 250, 0.3));
      width: 8.67rem;
      margin-top: 0.27rem;
      height: 1.2rem;
      @extend %flexBetween;
      input {
        border: 0;
        border-radius: 0;
        margin: 0;
        padding: 0;
        background: transparent;
        color: #fff;
        height: 1.2rem;
        line-height: 1.2rem;
      }
      img {
        width: .43rem;
        height: .43rem;
      }
    }
    .transferTips {
      color: red;
      width: 8.67rem;
      font-size: 0.37rem;
      padding-top: 0.2rem;
    }
  }
}
</style>