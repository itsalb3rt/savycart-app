<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card flat>
          <v-card-text>
            <form @submit.prevent="createCategory">
              <p>Las categorías te ayudan a realizar análisis más profundos para saber que categorías consumes más.</p>
              <v-text-field
                name="name"
                label="Categoria"
                id="name"
                v-model="name"
                placeholder="Ej: Gastable, legumbres…."
                autocomplete="off"
                @keyup="uppercase"
              ></v-text-field>
              <v-btn color="primary" type="submit" class="ml-0" :disabled="name.length == 0">
                <v-icon class="mr-2">fa-save</v-icon>Guardar
              </v-btn>
            </form>
            <v-layout row wrap>
              <v-flex xs12>
                <h4>CATEGORIAS REGISTRADAS</h4>
              </v-flex>
              <v-flex xs12>
                <v-data-table :headers="headers" :items="categories">
                  <template v-slot:no-data>
                    <v-alert
                      :value="true"
                      color="error"
                      icon="fa-warning"
                    >No hay ningun dato para mostrar</v-alert>
                  </template>
                  <template v-slot:items="category">
                    <td>{{category.index + 1}}</td>
                    <td>{{ category.item.name }}</td>
                    <td>
                      <v-btn
                        flat
                        small
                        color="error"
                        class="ml-0 pl-0"
                        @click="deleteCategory(category.index)"
                      >
                        <v-icon class="mr-2" small>fa-trash</v-icon>Eliminar
                      </v-btn>
                    </td>
                  </template>
                </v-data-table>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
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
      name: "",
      headers: [
        { text: "#", value: "index" },
        { text: "NOMBRE", value: "nombre" },
        { text: "ACCION", value: "accion" }
      ]
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
              `${this.apiDomain}/Miscellany/deleteCategory/${this.categories[index].id_category}`
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