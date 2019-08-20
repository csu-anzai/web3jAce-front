<template>
  <button type="button">{{ $t(txt) }}</button>
</template>

<script>
export default {
  name: 'publicBtn',
  props: {
    txt: String
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
button {
  width: 100%;
  height: 1.28rem;
  border-radius: .21rem;
  background: #fff;
  font-size: .37rem;
  box-sizing: border-box;
  @include border($c: #6d84f5,$d: bor);
  color: $blueColor;
  font-family: source-Regular;
}
</style>