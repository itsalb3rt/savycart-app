<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card flat>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>
                <p>{{ $t('settings.currency_description') }}</p>
                <div>
                  <v-select
                    v-model="preferredCurrencyCode"
                    :items="currenciesArray"
                    :label=" $t('settings.currency') "
                    item-text="symbol"
                    item-value="code"
                    required
                  ></v-select>
                  <v-btn color="success" class="ml-0" @click="saveCurrency">
                    <v-icon class="mr-2">fa-save</v-icon>
                    {{ $t('call_action_buttons.save') }} {{ $t('settings.currency') }}
                  </v-btn>
                </div>
              </v-flex>
              <v-flex xs12>
                <v-divider class="mt-2 mb-2"></v-divider>
              </v-flex>
              <v-flex xs12>
                <p>{{ $t('settings.tax_description') }}</p>

                <v-text-field
                  type="number"
                  v-model="itbis"
                  name="name"
                  :label=" $t('settings.tax') "
                  id="itbis_quantity"
                ></v-text-field>
                <v-btn color="success" @click="saveItbis">
                  <v-icon class="mr-2">fa-save</v-icon>
                  {{ $t('call_action_buttons.save') }} {{ $t('settings.tax') }}
                </v-btn>
              </v-flex>
              <v-flex xs12>
                <v-divider class="mt-2 mb-2"></v-divider>
              </v-flex>
              <v-flex xs12>
                <v-select
              v-model="language"
              :items="languageList"
              :label=" $t('settings.language') "
              item-text="name"
              item-value="value"
              required
            ></v-select>
                <v-btn color="success" @click="saveLanguage">
                  <v-icon class="mr-2">fa-save</v-icon>
                  {{ $t('call_action_buttons.save') }} {{ $t('settings.language') }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar :multi-line="snackbarMultiLine" v-model="snackbarShow" :color="snackbarColor">
      {{snackbarMessage}}
      <v-btn dark flat @click="snackbarShow = false">Cerrar</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import MenuComponent from "@/components/TheMenu";
import { mapState } from "vuex";
import axios from "axios";
import currencies from "@/mixins/miscellany/currencies";
import itbisMixin from "@/mixins/miscellany/Itbis";

export default {
  mixins: [currencies, itbisMixin],
  async mounted() {
    this.language =
      window.localStorage.getItem("language") == null
        ? "en"
        : window.localStorage.getItem("language");
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
      currenciesArray: [],
      snackbarShow: false,
      snackbarMessage: "",
      snackbarColor: "",
      snackbarMultiLine: true,
      language: "",
      languageList:[
        {name:'Español',value:'es'},
        {name:'English',value:'en'},
      ]
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
      let formData = new FormData();
      formData.append("id_user", this.user.id_user);
      formData.append("quantity", this.itbis);

      axios
        .post(`${this.apiDomain}/Miscellany/itbis`, formData)
        .then(response => {
          if (response.data.status == "success") {
            this.saveInIndexedDbItbis(this.itbis);
            this.snackbarShow = true;
            this.snackbarMessage = this.$t("call_action_buttons.save");
            this.snackbarColor = "success";
          }
        })
        .catch(e => {
          this.snackbarShow = true;
          this.snackbarMessage = this.$t("messages.server_error");
          this.snackbarColor = "error";
          console.log("TCL: saveItbis -> e", e);
        });
    },
    saveCurrency() {
      this.setPreferredCurrency(
        this.currencies[this.preferredCurrencyCode]
      ).then(() => {
        this.snackbarShow = true;
        this.snackbarMessage = this.$t("call_action_buttons.save");
        this.snackbarColor = "success";
      });
    },
    saveLanguage(){
      window.localStorage.setItem("language",this.language);
      this.$i18n.locale = this.language;
    }
  },
  computed: {
    ...mapState(["apiDomain", "user"])
  }
};
</script>