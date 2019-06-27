<template>
  <div>
    <MenuComponent title="Unidades medidas"/>
    <div class="container-app">
      <form action="#" method="POST" @submit.prevent="createMeasurementUnit">
        <div class="input-group">
          <div>
            <label for="name">Nombre</label>
            <input type="text" name="name" id="name" placeholder="UNIDAD" v-model="name" @keyup="uppercase">
          </div>
        </div>
        <div>
          <button type="submit" class="button primary small" :disabled="name.length == 0">
            <font-awesome-icon icon="save"/>&Tab;Guardar
          </button>
        </div>
      </form>
      <div>
        <h4>UNIDADES DE MEDIDA REGISTRADAS</h4>
        <div class="text small">
          <table class="table hover">
            <thead>
              <tr>
                <th>#</th>
                <th>UNIDAD MEDIDA</th>
                <th>ACCION</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(unit,index) in measurement_units" :key="index">
                <td>{{index + 1}}</td>
                <td>{{unit.name}}</td>
                <td>
                  <a class="danger undecoration" href="#" @click="deleteMeasurementUnit(index)">
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
      name: ""
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
              `${this.apiDomain}/Miscellany/deleteMeasurementUnit/${
                this.measurement_units[index].id_unit_measurement
              }`
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