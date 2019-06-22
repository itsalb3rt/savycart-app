<template>
  <div class="shopping-car-container" v-if="count > 0">
    <div class="car">
      <font-awesome-icon icon="shopping-cart"/>
      <span class="count">{{count}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    count: 0
  }
};

</script>
<style lang="css">
.shopping-car-container {
  position: absolute;
  top: 10px;
  right: 10px;
}
.car {
  font-size: 40px;
  margin-right: 7px;
}
.count {
  font-size: 14px;
  top: -8px;
  position: absolute;
  right: 0px;
  color: var(--white);
  background-color: var(--primary-blue);
  width: 25px;
  height: 25px;
  border-radius: 50%;
  text-align: center;
  line-height: 23px;
  border: 2px solid var(--white);
}
</style>