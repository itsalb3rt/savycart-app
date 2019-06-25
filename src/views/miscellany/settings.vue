<template>
  <div>
    <MenuComponent title="Ajustes"></MenuComponent>
    <div class="container-app">
      <div class="currencies-container">
        <p
          class="text"
        >La moneda es el prefijo que aparecerá delante del precio de los productos, totales e impuestos. eje: RD$150.</p>
        <div class="input-group">
          <div>
            <label for="currency">Moneda</label>
            <select name="currency" id="currency">
              <option value="1" selected>RD$</option>
            </select>
          </div>
        </div>
      </div>
      <hr>
      <div class="itbis-container">
        <p
          class="text"
        >El ITBIS es el impuesto aplicado a todos los productos que sean marcados para aplicarle este, la cantidad se basa en porcentaje (%).</p>
        <div class="input-group">
          <div>
            <label for="itbis_quantity">ITBIS</label>
            <input type="number" v-model="itbis" id="itbis_quantity">
          </div>
        </div>
        <div>
          <button class="button success small" @click="saveItbis">
            <font-awesome-icon icon="save"/>&Tab;Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuComponent from "@/components/MenuComponent";
import { mapState } from "vuex";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

export default {
  mounted() {
    this.getItbis();
  },
  components: {
    MenuComponent
  },
  data() {
    return {
      itbis: 1
    };
  },
  methods: {
    getItbis() {
      axios
        .get(`${this.apiDomain}/Miscellany/itbis?id_user=${this.user.id_user}`)
        .then(response => {
          this.itbis = response.data.quantity;
        });
    },
    saveItbis(){
        const notyf = new Notyf();
        let formData = new FormData();
        formData.append('id_user',this.user.id_user);
        formData.append('quantity',this.itbis);

        axios.post(`${this.apiDomain}/Miscellany/itbis`,formData)
        .then(response=>{
            if(response.data.status == 'success'){
                notyf.success('Itbis guardado!');
            }
        }).catch(e=>{
            notyf.error('Se ha producido un error al guardar!');
            console.log("TCL: saveItbis -> e", e);
        });
    }
  },
  computed: {
    ...mapState(["apiDomain", "user"])
  }
};
</script>