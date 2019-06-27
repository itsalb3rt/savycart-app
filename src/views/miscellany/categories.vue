<template>
  <div>
    <MenuComponent title="Categorias"/>
    <div class="container-app">
      <form action="#" method="POST" @submit.prevent="createCategory">
        <div>
          <p
            class="text small"
          >Las categorías te ayudan a realizar análisis más profundos para saber que categorías consumes más.</p>
        </div>
        <div class="input-group">
          <div>
            <label for="name">Nombre</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Gastable, legumbres…."
              v-model="name"
              @keyup="uppercase"
            >
          </div>
        </div>
        <div>
          <button type="submit" class="button primary small" :disabled="name.length == 0">
            <font-awesome-icon icon="save"/>&Tab;Guardar
          </button>
        </div>
      </form>
      <div>
        <h4>CATEGORIAS REGISTRADAS</h4>
        <div class="text small">
          <table class="table hover">
            <thead>
              <tr>
                <th>#</th>
                <th>CATEGORIA</th>
                <th>ACCION</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(category,index) in categories" :key="index">
                <td>{{index + 1}}</td>
                <td>{{category.name}}</td>
                <td>
                  <a class="danger undecoration" href="#" @click="deleteCategory(index)">
                    <font-awesome-icon icon="trash"/>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import MenuComponent from "@/components/TheMenu.vue";
import categories from "@/mixins/miscellany/categories";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

export default {
  mixins: [categories],
  mounted() {
    if (this.online) {
      this.requestCategories(axios);
    }
  },
  data: function() {
    return {
      name: ""
    };
  },
  components: {
    MenuComponent
  },
  computed: {
    ...mapState(["categories", "online", "apiDomain", "user"])
  },
  methods: {
    ...mapMutations(["setCategories", "addCategory", "removeCategory"]),
    createCategory() {
      let formData = new FormData();
      formData.append("id_user", this.user.id_user);
      formData.append("name", this.name);
      const notyf = new Notyf();

      if (this.online) {
        axios
          .post(`${this.apiDomain}/Miscellany/addCategory`, formData)
          .then(response => {
            if (response.data.status == "success") {
              this.addCategory({
                id_category: response.data.data.id,
                name: this.name
              });
              this.name = "";
              notyf.success("Categoria guardada!");
            }
          })
          .catch(function(error) {
            console.log("TCL: createCategory -> error", error);
          });
      } else {
        notyf.error(
          "Debes estar conectado a internet para realizar esta accion."
        );
      }
    },
    deleteCategory(index) {
      let request = confirm(
        "Esta seguro que desea eliminar esta unidad de medida?"
      );
      const notyf = new Notyf();
      if (request) {
        if (this.online) {
          axios
            .get(
              `${this.apiDomain}/Miscellany/deleteCategory/${
                this.categories[index].id_category
              }`
            )
            .then(response => {
              if (response.data.status == "success") {
                this.removeCategory(index);
                notyf.success("Categoria eliminada!");
              } else if (response.data.status == "hasDependency") {
                notyf.error({
                  message:
                    "Esta categoría no puede ser elimina porque tiene productos asociados",
                  duration: 9000
                });
              }
            })
            .catch(function(error) {
              console.log("TCL: deleteCategory -> error", error);
            });
        } else {
          notyf.error(
            "Debes estar conectado a internet para realizar esta accion."
          );
        }
      }
    },
    uppercase() {
      this.name = this.name.toUpperCase();
    }
  }
};
</script>