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
            <select name="currency" id="currency" v-model="preferredCurrencyCode">
              <option
                :value="currency.code"
                v-for=" (currency,index) in currencies "
                :key="index"
              >{{currency.symbol}} - {{currency.name}}</option>
            </select>
          </div>
        </div>

        <div>
          <button class="button success small" @click="saveCurrency">
            <font-awesome-icon icon="save"/>&Tab;Guardar moneda
          </button>
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
            <font-awesome-icon icon="save"/>&Tab;Guardar ITBIS
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuComponent from "@/components/TheMenu";
import { mapState } from "vuex";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import currencies from "@/mixins/miscellany/currencies";
import itbisMixin from '@/mixins/miscellany/Itbis';

export default {
  mixins: [currencies,itbisMixin],
  async mounted() {
    this.getItbis();
    this.currencies = await this.getCurrencies();
    this.preferredCurrency = await this.getPreferredCurrency();
    this.preferredCurrencyCode = this.preferredCurrency.code;
  },
  components: {
    MenuComponent
  },
  data() {
    return {
      itbis: 1,
      db: [],
      currencies: [],
      preferredCurrency:[],
      preferredCurrencyCode:''
    };
  },
  methods: {
    getItbis() {
      axios
        .get(`${this.apiDomain}/Miscellany/itbis?id_user=${this.user.id_user}`)
        .then(response => {
          this.itbis = response.data.quantity;
          this.saveInIndexedDbItbis(this.itbis);
        });
    },
    saveItbis() {
      const notyf = new Notyf();
      let formData = new FormData();
      formData.append("id_user", this.user.id_user);
      formData.append("quantity", this.itbis);

      axios
        .post(`${this.apiDomain}/Miscellany/itbis`, formData)
        .then(response => {
          if (response.data.status == "success") {
            this.saveInIndexedDbItbis(this.itbis);
            notyf.success("Itbis guardado!");
          }
        })
        .catch(e => {
          notyf.error("Se ha producido un error al guardar!");
          console.log("TCL: saveItbis -> e", e);
        });
    },
    saveCurrency(){
      this.setPreferredCurrency(this.currencies[this.preferredCurrencyCode])
      .then(()=>{
        const notyf = new Notyf();
        notyf.success('Moneda guardada');
      });      
    }
  },
  computed: {
    ...mapState(["apiDomain", "user"])
  }
};
</script>