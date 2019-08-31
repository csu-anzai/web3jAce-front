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
      <section>
        <img src="../assets/image/error.png" alt="">
        {{ $t("home.homeTips") }}
      </section>
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
// import '../utils/homeBgCanvas.js'

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
      phomePage: 0
    }
  },
  computed: {

  },
  created() {
    
  },
  mounted() {
    let that = this
    /**
     * 判断是否是 imToken 环境
     */
    let flg = !!window.imToken
    if (!flg) {
      this.phomePage = 1
    } else {
      this.phomePage = 0
    }
    // if (this.phomePage === 1) {
    //   document.getElementsByTagName('canvas')[0].style.visibility = "hidden"
    // } else {
    //   document.getElementsByTagName('canvas')[0].style.visibility = "visible"
    // }

    // 判断是否授权
    let address = sessionStorage.getItem("address")
    if (address === "" || address === null) {
      let tipsTxt = '获取钱包信息失败，请重新获取！'
      imToken.callAPI('native.confirm', {
        title: '温馨提示',
        message: tipsTxt,
        cancelText: '取消',
        confirmText: '确定'
      }, function (err, result) {
        that.$router.push({ path: '/' })
      })
    } else {
      that.getInfoAll()
      that.currentAddress = address
    }
  },
  destroyed() {
    //document.getElementsByTagName('canvas')[0].style.visibility = "hidden"
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
      this.$axios.post(_const.url + "/aceWeb/operateBtt/operateAccount", this.qs.stringify({ "address": sessionStorage.getItem("address") })).then(res => {
        let data = res.data.data
        console.log(data)
        if (data === "" || data === null) {
          this.withdrawIpt = 0 //可提现余额
          imToken.callAPI('native.toastInfo', '用户不存在或者其他错误')
        } else {
          this.withdrawIpt = this.cal.accSub((data.receiveAmountEth || 0), (data.withdrawAmountEth || 0)) //可提现余额
        }
        let flg1 = data.rechargeAmountEth > 0 && data.rechargeAmountEth * 500 < data.rechargeAmountBbt
        let flg2 = data.rechargeAmountEth > 0 && (data.rechargeAmountBbt === 0 || data.rechargeAmountBbt === null)
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
    @include bgCover('../assets/image/banner.jpg');
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
    input {
      width: 8.67rem;
      margin-top: 0.27rem;
      padding: 0.35rem 0;
      border: 0;
      @include border($d: bottom,$c: rgba(250,250,250,.3));
      border-radius: 0;
      background: transparent;
      color: #fff;
    }
  }
  .imToken-content {
    background: #151515;
    height: calc(100vh - 0.35rem);
    color: #D9D2C3;
    overflow: hidden;
    font-size: .37rem;
    @extend %flexCenter;
    flex-direction: column;
    section {
      @extend %flexCenter;
      flex-direction: column;
      img {
        width: 2.7rem;
        height: 2.7rem;
        margin-bottom: 1.65rem;
      }
    }
  }
}
</style>