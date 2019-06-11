<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div id="mySidenav" class="sidenav">
          <a href="javascript:void(0)" class="closebtn" @click="closeNav">&times;</a>
          <router-link to="/">Home</router-link>
          <router-link to="/about">About</router-link>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 menu-container">
        <div class="menu-icon">
          <span style="cursor:pointer;font-weight: bold;" @click="openNav">&#9776;</span>
          <a href="#" class="primary important undecoration" style="margin-left: 10px;">Titulo</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    openNav() {
      document.querySelector("#mySidenav").style.width = "100%";
    },
    closeNav() {
      document.querySelector("#mySidenav").style.width = "0";
    }
  }
};
</script>