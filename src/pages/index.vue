<template>
  <main class="login-container">
    <section class="login-content" v-if="phomePage === 0">
      <img src="../assets/image/login.png" alt="" />
      <public-btn :txt="loginBtn" @click.native="getWalletAddress" />
    </section>

    <section class="imToken-content" v-if="phomePage === 1">
      <section>
        <img src="../assets/image/error.png" alt="" />
        {{ $t("home.homeTips") }}
      </section>
    </section>
  </main>
</template>

<script>
import publicBtn from '../components/public-btn'
export default {
  name: '',
  components: {
    publicBtn
  },
  props: {},
  data() {
    return {
      loginBtn: 'home.loginBtn',
      phomePage: 0
    }
  },
  computed: {

  },
  created() {
    /**
     * 判断是否是 imToken 环境
     */
    let that = this
    let flg = !!window.imToken
    if (!flg) {
      this.phomePage = 1
    } else {
      this.phomePage = 0
    }

    imToken.callAPI('user.getCurrentAccount', function (err, address) {
      if (err) {
        imToken.callAPI('native.toastInfo', '授权获取地址失败，请重新获取')
      } else {
        that.currentAddress = address
        that.judgeReg(address)
        console.log(that.currentAddress)
        return
      }
    })
  },
  mounted() {

  },
  destroyed() { },
  methods: {
    getWalletAddress() {
      this.$router.push({ path: '/home', query: { 'walletAddress': this.currentAddress } })
    },

    judgeReg(address) {
      console.log("判断是否注册：" + address)
      this.$axios.get(_const.url + "/aceWeb/operateBtt/getAccount?address=" + address).then(res => {
        console.log(res.data)
        if (res.data.statusCode != 200) {
          this.regUser(address)
        }
      }).catch(error => {
        imToken.callAPI('native.toastInfo', '系统错误，请稍后重试...')
        console.log(error);
      });
    },

    regUser(address) {
      console.log("新用户注册钱包：" + address)
      var currentAddress;
      var regAddres = this.getQueryString('address');
      if (regAddres === null) {
        currentAddress = address
      } else {
        currentAddress = regAddres
      }
      let parm = {
        "address": currentAddress,
        "refAddress": address
      }
      console.log(parm)
      this.$axios.post(_const.url + "/aceWeb/operateBtt/operateAccount", this.qs.stringify(parm)).then(res => {
        let data = res.data
        if (data.statusCode == 200) {
          console.log("注册成功")
          //alert("成功")
        } else {
          imToken.callAPI('native.toastInfo', '注册失败：' + data.statusMsg)
          //alert('复制失败：' + data.statusMsg)
        }
      }).catch(error => {
        console.log(error)
        imToken.callAPI('native.toastInfo', '系统错误，请稍后重试...')
        //alert("系统错误，请稍后重试")
      });
    },

    //获取超链接地址
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return (r[2]);
      return null;
    }
  },
}
</script>

<style scoped lang="scss">
@import "../assets/styless/public";
.login-container {
  background: #151515;
  height: 100vh;
  @extend %flexCenter;
  overflow: hidden;
  flex-direction: column;
  .login-content {
    @extend %flexCenter;
    flex-direction: column;
    width: 4.65rem;
    img {
      width: 3.6rem;
      height: 3.1rem;
      margin-bottom: 2.4rem;
    }
  }

  .imToken-content {
    color: #d9d2c3;
    font-size: 0.37rem;
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