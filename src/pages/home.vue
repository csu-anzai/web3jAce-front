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
import Clipboard from 'clipboard'

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
      walletAddress: ''
    }
  },
  computed: {

  },
  created() {
    imToken.callAPI('user.getCurrentAccount', function (err, address) {
      if (err) {
        imToken.callAPI('native.toastInfo', '获取钱包信息失败，请稍后重试')
      } else {
        console.log("获取钱包信息")
        this.walletAddress = address
      }
    })
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
      let that = this
      let address1 = that.walletAddress
      let address2 = that.invitationIpt.replace(/\s+/g, "")
      let parm = {
        "address": address1,
        "refAddress": address2
      }
      
      that.$axios.post(_const.url + "/apis/aceWeb/operateBtt/operateAccount", this.qs.stringify(parm)).then(function (res) {
        let data = res.data
        let code = data.statusCode
        console.log(res)
        if (code == 200) {
          imToken.callAPI('native.setClipboard', _const.urlLink + '/?address=' + address1)
          imToken.callAPI('native.toastInfo', '复制成功')
        } else {
          imToken.callAPI('native.toastInfo', '复制失败')
          that.invitationIpt = ""
        }
      }).catch(function (error) {
        imToken.callAPI('native.toastInfo', '系统错误，请稍后重试...')
      });
    },

    //提现
    withdrawal() {
      let ipt = this.withdrawIpt.replace(/\s+/g, "")
      let amountRes = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
      if (!amountRes.test(ipt)) {
        imToken.callAPI('native.toastInfo', '请输入正确的金额')
        return
      }
      const parm = {
        "address": this.walletAddress, //提现地址
        "amount": ipt //提现数额 字符串，单位：eth
      }
      let that = this
      that.$axios.post(_const.url + '/aceWeb/operateBtt/withdraw', this.qs.stringify(parm)).then(res => {
        let data = res.data
        let code = data.statusCode
        if (code == 200) {
          imToken.callAPI('native.toastInfo', '提现成功')
        } else {
          imToken.callAPI('native.toastInfo', '提现失败：' + data.statusMsg)
        }
      }).catch(function (error) {
        imToken.callAPI('native.toastInfo', '系统错误，请稍后重试...')
      });
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
      padding: .35rem 0;
      border: 0;
      @include border($d: bottom);
      border-radius: 0;
    }
  }
}
</style>