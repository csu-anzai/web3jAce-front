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
  @include border($c: rgba(255,255,255,.3),$d: bor);
  color: #E7C054;
  background: #262626;
  font-family: source-Regular;
}
</style>