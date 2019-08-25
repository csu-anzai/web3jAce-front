<template>
  <div id="app" class="bbt-container">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {

    }
  },
  created() {
    /**
     * 获取钱包地址 保存在 session
     */
    imToken.callAPI('user.getCurrentAccount', function (err, address) {
      if (err) {
        imToken.callAPI('native.toastInfo', '获取钱包信息失败，请稍后重试')
      } else {
        sessionStorage.setItem("walletAddress", address)
      }
    })
  },
  methods: {

  },
}
</script>

<style>
.bbt-container {
  width: 10rem;
  margin: 0 auto;
}
</style>
