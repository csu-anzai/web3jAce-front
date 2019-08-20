<template>
  <nav>
    <img src="../assets/image/returnImg.png" alt=""  @click="returnPage"/>
    <span @click="functionPage" v-show="navRight">{{ $t('withdraw.settingBtn') }}</span>
  </nav>
</template>

<script>
export default {
  name: 'publicNav',
  props: {
    navRight: Boolean
  },
  data() {
    return {

    }
  },
  methods: {
    returnPage () {
      this.$emit('returnPage')
    },

    functionPage () {
      this.$emit('functionPage')
    }
  },
}
</script>

<style scoped lang="scss">
@import "../assets/styless/public";
nav {
  height: 1.17rem;
  padding: 0 0.4rem;
  @extend %flexBetween;
  img {
    width: 1.17rem;
    height: 1.17rem;
  }
  span {
    display: block;
    padding: 0 .75rem;
    height: .85rem;
    line-height: .85rem;
    background:rgba(109,132,245,0.1);
    @include border($c: #6d84f5,$d: bor);
    font-size: .37rem;
    color: $blueColor;
    border-radius: .05rem;
    font-family: source-Regular;
  }
}
</style>