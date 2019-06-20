<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div id="mySidenav" class="sidenav">
          <div class="top-container">
            <a href="javascript:void(0)" class="closebtn" @click="closeNav">&times;</a>
            <div class="user-information">
              <div class="full-name">{{user.first_name}} {{user.last_name}}</div>
              <div class="email">{{user.email}}</div>
            </div>
          </div>
          <div class="menu-elements">
            <router-link to="product/list">
              <font-awesome-icon icon="clipboard-list"/>Mi lista
            </router-link>
            <router-link to="/none">
              <font-awesome-icon icon="shopping-cart"/>Registrar Compra
            </router-link>
            <router-link to="/none">
              <font-awesome-icon icon="history"/>Historial de compras
            </router-link>
            <router-link to="/none">
              <font-awesome-icon icon="chart-bar"/>Analisis
            </router-link>
            <div class="category">Ajustes</div>
            <router-link to="/measurement_units">
              <font-awesome-icon icon="balance-scale"/>Unidades de medidas
            </router-link>
            <router-link to="/categories">
              <font-awesome-icon icon="list-ul"/>Categorias
            </router-link>
            <router-link to="/none">
              <font-awesome-icon icon="cog"/>Mas ajusted
            </router-link>
            <router-link to="/auth/logout">
              <font-awesome-icon icon="sign-out-alt"/>Cerrar sesion
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 menu-container">
        <div class="menu-icon">
          <span style="cursor:pointer;font-weight: bold;" @click="openNav">&#9776;</span>
          <a href="#" class="primary important undecoration" style="margin-left: 10px;">{{title}}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    title: ""
  },
  computed: {
    ...mapState(["user"])
  },
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