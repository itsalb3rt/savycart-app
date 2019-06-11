<template>
  <div class="container">
    <router-view/>
  </div>
</template>

<script>
import MenuComponent from './components/MenuComponent.vue'

export default {
  components:{
    MenuComponent
  }
};
</script>