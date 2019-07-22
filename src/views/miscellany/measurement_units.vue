<template>
  <v-container grid-list-xs>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card flat>
          <v-card-text>
            <form @submit.prevent="createMeasurementUnit">
              <v-text-field
                name="name"
                label="Nombre"
                id="name"
                v-model="name"
                @keyup="uppercase"
                placeholder="Ej: UNIDAD"
                autocomplete="off"
              ></v-text-field>
              <v-btn small type="submit" color="primary" class="ml-0" :disabled="name.length == 0">
                <v-icon small class="mr-2">fa-save</v-icon>Guardar
              </v-btn>
            </form>
            <v-layout row wrap>
              <v-flex xs12>
                <h4>UNIDADES DE MEDIDA REGISTRADAS</h4>
              </v-flex>
              <v-flex xs12>
                <v-data-table :headers="headers" :items="measurement_units">
                  <template v-slot:no-data>
                    <v-alert
                      :value="true"
                      color="error"
                      icon="fa-warning"
                    >No hay ningun dato para mostrar</v-alert>
                  </template>
                  <template v-slot:items="unit">
                    <td>{{unit.index + 1}}</td>
                    <td>{{ unit.item.name }}</td>
                    <td>
                      <v-btn flat small color="error" class="ml-0 pl-0" @click="deleteMeasurementUnit(unit.index)">
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
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import MenuComponent from "@/components/TheMenu.vue";
import measurementUnits from "@/mixins/miscellany/measurementUnits";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

export default {
  mixins: [measurementUnits],
  mounted() {
    if (this.online) {
      this.requestMeasurementUnit(axios);
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
    ...mapState(["measurement_units", "online", "apiDomain", "user"])
  },
  methods: {
    ...mapMutations([
      "addMeasurementUnit",
      "setMeasurementUnit",
      "removeMeasurementUnit"
    ]),

    createMeasurementUnit() {
      let formData = new FormData();
      formData.append("id_user", this.user.id_user);
      formData.append("name", this.name);
      const notyf = new Notyf();

      if (this.online) {
        axios
          .post(`${this.apiDomain}/Miscellany/addMeasurementUnit`, formData)
          .then(response => {
            if (response.data.status == "success") {
              this.addMeasurementUnit({
                id_unit_measurement: response.data.data.id,
                name: this.name
              });
              this.name = "";
              notyf.success("Unidad guardada!");
            }
          })
          .catch(function(error) {
            console.log("TCL: addMeasurementUnit -> error", error);
          });
      } else {
        notyf.error(
          "Debes estar conectado a internet para realizar esta accion."
        );
      }
    },
    deleteMeasurementUnit(index) {
      let request = confirm(
        "Esta seguro que desea eliminar esta unidad de medida?"
      );
      const notyf = new Notyf();
      if (request) {
        if (this.online) {
          axios
            .get(
              `${this.apiDomain}/Miscellany/deleteMeasurementUnit/${this.measurement_units[index].id_unit_measurement}`
            )
            .then(response => {
              if (response.data.status == "success") {
                this.removeMeasurementUnit(index);
                notyf.success("Unidad eliminada!");
              } else if (response.data.status == "hasDependency") {
                notyf.error({
                  message:
                    "Esta unidad de medida no puede ser elimina porque tiene productos asociados",
                  duration: 9000
                });
              }
            })
            .catch(function(error) {
              console.log("TCL: deleteMeasurementUnit -> error", error);
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