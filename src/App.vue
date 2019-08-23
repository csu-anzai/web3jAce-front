<template>
  <div id="app" class="bbt-container">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    // imToken.callAPI('user.getCurrentAccount', function (err, address) {
    //   if (err) {
    //     imToken.callAPI('native.toastInfo', '获取钱包信息失败，请稍后重试')
    //   } else {
    //     // 获取信息
    //     that.$axios.get(_const.url + "/aceWeb/operateBtt/getAccount?address=" + address).then(res => {
    //       let data = res.data
    //       if (data === "" || data === null) {
    //         this.$router.push({ path: '/404' })
    //       }
    //     }).catch(error => {
    //       console.log("获取用户信息错误")
    //       console.log(error);
    //     });
    //   }
    // })
  },
}
</script>

<style>
.bbt-container {
  width: 10rem;
  margin: 0 auto;
}
</style>
