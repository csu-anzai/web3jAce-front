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

        <public-btn :txt="withdrawBtn" @click.native="withdrawal" />

        <input
          type="text"
          placeholder="请输入被邀请人钱包地址"
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
      invitationIpt: '',
      toastShow: false,
      toastTxt: ''
    }
  },
  computed: {

  },
  created() {

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
      let parm = {
        "address": '0x09ced3ca4a35a636e5e190a1608e4b0299109e8',
        "refAddress": this.invitationIpt.replace(/\s+/g, "")
      }
      let that = this
      that.$axios.post("http://123.108.111.18/apis/aceWeb/operateBtt/operateAccount",this.qs.stringify(parm)).then(function (res) {
          let data = res.data
          let code = data.statusCode
          if (code == 200) {
            that.toastTxt = '复制成功'
            that.toastShow = true
            setTimeout(() => {
              that.toastShow = false
            }, 3000)
            imToken.callAPI('native.setClipboard', '复制内容?')
          } else {
            that.toastTxt = '复制失败' + data.statusMsg
            that.toastShow = true
            setTimeout(() => {
              that.toastShow = false
            }, 3000)
            that.invitationIpt = ""
          }
        }).catch(function (error) {
          that.toastTxt = '系统错误，请稍后重试...'
          that.toastShow = true
          setTimeout(() => {
            that.toastShow = false
          }, 3000)
        });
    },

    //提现
    withdrawal() {
      const parm = {
        "address": "0xcafb789d00a0e5855f9521d1e589ed437554caa1", //提现地址
        "amount": "0.001" //提现数额 字符串，单位：eth
      }
      let that = this
      this.$axios.post('http://123.108.111.18/apis/aceWeb/operateBtt/withdraw', this.qs.stringify(parm)).then(res => {
        let data = res.data
        let code = data.statusCode
        if (code == 200) {
          that.toastTxt = '提现成功'
          that.toastShow = true
          setTimeout(() => {
            that.toastShow = false
          }, 3000)
        } else {
          that.toastTxt = '提现失败' + data.statusMsg
          that.toastShow = true
          setTimeout(() => {
            that.toastShow = false
          }, 3000)
        }
      }).catch(function (error) {
        that.toastTxt = '系统错误，请稍后重试...'
        that.toastShow = true
        setTimeout(() => {
          that.toastShow = false
        }, 3000)
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
      height: 1.25rem;
      line-height: 1.25rem;
      border: 0;
      @include border($d: bottom);
    }
  }
}
</style>