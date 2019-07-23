<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card flat>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>
                <p>La moneda es el prefijo que aparecerá delante del precio de los productos, totales e impuestos. eje: RD$150.</p>
                <div>
                  <v-select
                    v-model="preferredCurrencyCode"
                    :items="currenciesArray"
                    label="Moneda"
                    item-text="symbol"
                    item-value="code"
                    required
                  ></v-select>
                  <v-btn color="success" class="ml-0" @click="saveCurrency">
                    <v-icon class="mr-2">fa-save</v-icon>Guardar moneda
                  </v-btn>
                </div>
              </v-flex>
              <v-flex xs12>
                <v-divider class="mt-2 mb-2"></v-divider>
              </v-flex>
              <v-flex xs12>
                <p>El ITBIS es el impuesto aplicado a todos los productos que sean marcados para aplicarle este, la cantidad se basa en porcentaje (%).</p>

                <v-text-field
                  type="number"
                  v-model="itbis"
                  name="name"
                  label="ITBIS"
                  id="itbis_quantity"
                ></v-text-field>
                <v-btn color="success" @click="saveItbis">
                  <v-icon class="mr-2">fa-save</v-icon>Guardar ITBIS
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import MenuComponent from "@/components/TheMenu";
import { mapState } from "vuex";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import currencies from "@/mixins/miscellany/currencies";
import itbisMixin from "@/mixins/miscellany/Itbis";

export default {
  mixins: [currencies, itbisMixin],
  async mounted() {
    this.getItbis();
    this.getCurrencies().then(resp => {
      this.currencies = resp;
      for (let key in resp) {
        this.currenciesArray.push({
          code: resp[key].code,
          symbol: resp[key].symbol,
          name: resp[key].name
        });
      }
    });
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
      preferredCurrency: [],
      preferredCurrencyCode: "",
      currenciesArray: []
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
    saveCurrency() {
      this.setPreferredCurrency(
        this.currencies[this.preferredCurrencyCode]
      ).then(() => {
        const notyf = new Notyf();
        notyf.success("Moneda guardada");
      });
    }
  },
  computed: {
    ...mapState(["apiDomain", "user"])
  }
};
</script>