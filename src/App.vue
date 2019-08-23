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

    this.$axios.post(_const.url + "/aceWeb/operateBtt/operateAccount", this.qs.stringify({ "address": '0x09ced3ca4a35a636e5e190a1608e4b0299109e8' })).then(res => {
     
      let data = res.data.data
       console.log(data)
      if (data === "" || data === null) {
        this.$router.push({ path: '/404' })
      }
    }).catch(error => {
      console.log("获取用户信息错误")
      console.log(error);
    });
  },
}
</script>

<style>
.bbt-container {
  width: 10rem;
  margin: 0 auto;
}
</style>
