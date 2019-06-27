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
            <router-link to="/product/list">
              <font-awesome-icon style="color:var(--success-green)" icon="clipboard-list"/>Mi lista
            </router-link>
            <router-link to="/shop/registation">
              <font-awesome-icon style="color:var(--primary-blue)" icon="shopping-cart"/>Registrar compra
            </router-link>
            <router-link to="/analysis/shopping_history">
              <font-awesome-icon icon="history"/>Historial de compras
            </router-link>
            <router-link to="/none">
              <font-awesome-icon style="color:#9C27B0" icon="chart-bar"/>Analisis
            </router-link>
            <div class="category">Ajustes</div>
            <router-link to="/measurement_units">
              <font-awesome-icon icon="balance-scale"/>Unidades de medidas
            </router-link>
            <router-link to="/categories">
              <font-awesome-icon icon="list-ul"/>Categorias
            </router-link>
            <router-link to="/settings">
              <font-awesome-icon icon="cog"/>Mas ajustes
            </router-link>
            <router-link to="/auth/logout">
              <font-awesome-icon style="color:var(--danger-red)" icon="sign-out-alt"/>Cerrar sesion
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
      document.querySelector("#mySidenav").style.left = "0";
    },
    closeNav() {
      document.querySelector("#mySidenav").style.left = "-100%";
    }
  }
};
</script>
<style>
/*Menu*/
.sidenav {
    height: 100%;
    width: 100%;
    position: fixed;
    z-index: 1;
    top: 0;
    left: -100%;
    background-color: #F5F5F5;
    overflow-x: hidden;
    transition:left 0.5s ease-in-out;
    text-align: center;
}
.top-container{
    padding-top: 40px;
}

.menu-elements svg{
    margin-right: 20px;
}
.menu-elements{
    font-size: 18px;
    text-align: left
}

.sidenav a {
    padding: 20px 8px 8px 32px;
    text-decoration: none;
    color: var(--black);
    display: block;
    transition: 0.3s;
}

.category{
    color: var(--grey);
    padding: 20px 8px 8px 32px;
    font-size: 14px;
}

.sidenav a:hover {
    color: #f1f1f1;
}

.sidenav .closebtn {
    position: absolute;
    top: 6px;
    right: 25px;
    font-size: 26px;
    color: var(--white);
    font-weight: bold;
    margin-left: 50px;
    background-color: var(--black);
    padding: 0px 7px;
    border-radius: 4px;
}

.sidenav .user-information .full-name{
    font-weight: bold;
}
.sidenav .user-information{
    text-align: left!important;
    font-size: 14px;
    padding: 10px 0px;
    border-bottom: 4px solid var(--primary-blue);
}

.sidenav .user-information > div{
    margin: 10px auto;
    margin: 10px 10px 0px 30px;
}

@media screen and (max-height: 450px) {
    .sidenav {
        padding-top: 15px;
    }

    .sidenav a {
        font-size: 18px;
    }
}

.menu-icon{
    font-size: 18px;
    margin: 10px;
    padding: 10px 10px;
}

.menu-container{
    border-bottom: solid 2px var(--primary-blue);
}
</style>
