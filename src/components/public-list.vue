<template>
  <main>
    <ul>
      <li v-for="(item, index) in itemList" :key="index">
        <span>{{ $t(item.tit) }}</span>
        <span>{{ item.txt }}</span>
      </li>
    </ul>
  </main>
</template>

<script>
export default {
  name: 'publicList',
  props: {
    itemList: Array
  },
  data() {
    return {

    }
  },
  methods: {

  },
}
</script>

<style scoped lang="scss">
@import "../assets/styless/public";
ul {
  padding: 1.04rem 0.4rem 0.33rem;
  li {
    @extend %flexBetween2;
    color: $blueColor;
    font-family: source-Regular;
    span:first-child {
      position: relative;
      width: 3.93rem;
      padding: 0 0 0.69rem 0.67rem;
      color: #7a8099;
      font-size: 0.37rem;
      &::before {
        content: "";
        width: .16rem;
        height: .16rem;
        position: absolute;
        top: 0.1rem;
        left: -0.04rem;
        border-radius: 50%;
        background: $blueColor;
      }
      &::after {
        content: "";
        width: .03rem;
        height: calc(100%);
        position: absolute;
        top: .26rem;
        left: .036rem;
        background: #e6e6e6;
      }
    }
    &:last-child span:first-child::after {
      display: none;
    }
  }
}
</style>