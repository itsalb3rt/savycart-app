<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card flat>
          <v-card-text>
            <form @submit.prevent="createMeasurementUnit">
              <v-text-field
                :name=" $t('measurement_unit.name') "
                label="Nombre"
                id="name"
                v-model="name"
                @keyup="uppercase"
                :placeholder=" $t('measurement_unit.measurement_placeholder') "
                autocomplete="off"
              ></v-text-field>
              <v-btn small type="submit" color="primary" class="ml-0" :disabled="name.length == 0">
                <v-icon small class="mr-2">fa-save</v-icon>{{ $t('call_action_buttons.save') }}
              </v-btn>
            </form>
            <v-layout row wrap>
              <v-flex xs12>
                <h4>{{ $t('measurement_unit.registered_measurement') }}</h4>
              </v-flex>
              <v-flex xs12>
                <v-data-table :headers="headers" :items="measurement_units">
                  <template v-slot:no-data>
                    <v-alert
                      :value="true"
                      color="error"
                      icon="fa-warning"
                    >{{ $t('message.nothing_to_display') }}</v-alert>
                  </template>
                  <template v-slot:items="unit">
                    <td>{{unit.index + 1}}</td>
                    <td>{{ unit.item.name }}</td>
                    <td>
                      <v-btn
                        flat
                        small
                        color="error"
                        class="ml-0 pl-0"
                        @click="dispatchDeleteMesasurementUnit(unit.index)"
                      >
                        <v-icon class="mr-2" small>fa-trash</v-icon>{{ $t('call_action_buttons.delete') }}
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
    <v-layout row justify-center>
      <v-dialog v-model="showDialogDeleteMeasurementUnit" persistent full-width>
        <v-card>
          <v-card-title class="headline">{{ $t('call_action_buttons.delete') }} {{ $t('measurement_unit.measurement') }}</v-card-title>
          <v-card-text>{{ $t('messages.confirm_delete_message') }} {{ $t('measurement_unit.measurement') }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="deleteMeasurementUnit()">{{ $t('call_action_buttons.delete') }}</v-btn>
            <v-btn color="primary" flat @click="showDialogDeleteMeasurementUnit = false">{{ $t('messages.keep') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-snackbar :multi-line="snackbarMultiLine" v-model="snackbarShow" :color="snackbarColor">
      {{snackbarMessage}}
      <v-btn dark flat @click="snackbarShow = false">{{ $t('call_action_buttons.close') }}</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import MenuComponent from "@/components/TheMenu.vue";
import measurementUnits from "@/mixins/miscellany/measurementUnits";
import axios from "axios";

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
        { text: this.$t('measurement_unit.name'), value: "nombre" },
        { text: this.$t('call_action_buttons.action'), value: "accion" }
      ],
      snackbarShow: false,
      snackbarMessage: "",
      snackbarColor: "",
      snackbarMultiLine: true,
      indexMeasurementUnitForDelete: "",
      showDialogDeleteMeasurementUnit: false
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
              this.snackbarShow = true;
              this.snackbarMessage = this.$t('messages.save');
              this.snackbarColor = "success";
            }
          })
          .catch(function(error) {
            console.log("TCL: addMeasurementUnit -> error", error);
          });
      } else {
        this.snackbarShow = true;
        this.snackbarMessage = this.$t('messages.intenet_required') ;
        this.snackbarColor = "error";
      }
    },
    dispatchDeleteMesasurementUnit(index){
      this.showDialogDeleteMeasurementUnit = true;
      this.indexMeasurementUnitForDelete = index;
    },
    deleteMeasurementUnit() {
      
        if (this.online) {
          axios
            .get(
              `${this.apiDomain}/Miscellany/deleteMeasurementUnit/${this.measurement_units[this.indexMeasurementUnitForDelete].id_unit_measurement}`
            )
            .then(response => {
              if (response.data.status == "success") {
                this.removeMeasurementUnit(this.indexMeasurementUnitForDelete);
                this.snackbarShow = true;
                this.snackbarMessage = this.$t('call_action_buttons.delete');
                this.snackbarColor = "success";
              } else if (response.data.status == "hasDependency") {
                this.snackbarShow = true;
                this.snackbarMessage =this.$t('measurement_unit.forbiden_delete') ;
                this.snackbarColor = "error";
              }
            })
            .catch(function(error) {
              console.log("TCL: deleteMeasurementUnit -> error", error);
            });
        } else {
          this.snackbarShow = true;
          this.snackbarMessage =this.$t('messages.intenet_required') ;
          this.snackbarColor = "error";
        }
        this.showDialogDeleteMeasurementUnit = false;
    },
    uppercase() {
      this.name = this.name.toUpperCase();
    }
  }
};
</script>