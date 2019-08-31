<template>
  <main class="login-content">
    <section>
      <img src="../assets/image/login.png" alt="" />
      <public-btn :txt="loginBtn" @click.native="getWalletAddress"/>
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
      loginBtn: 'home.loginBtn'
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {

  },
  destroyed() { },
  methods: {
    getWalletAddress() {
      var that = this
      //that.$router.push({ path: '/home' })
      imToken.callAPI('user.getCurrentAccount', function (err, address) {
        if (err) {
          imToken.callAPI('native.toastInfo', '授权获取地址失败，请重新获取')
        } else {
          sessionStorage.setItem("address", address)
          that.$router.push({ path: '/home' })
        }
      })
    }
  },
}
</script>

<style scoped lang="scss">
@import "../assets/styless/public";
.login-content {
  background: rgba(21, 21, 21, 1);
  height: 100vh;
  @extend %flexCenter;
  flex-direction: column;
  section {
    @extend %flexCenter;
    flex-direction: column;
    width: 4.65rem;
    img {
      width: 3.6rem;
      height: 3.1rem;
      margin-bottom: 2.4rem;
    }
  }
  
}
</style>