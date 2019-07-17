<template>
  <div>
    <MenuComponent title="Nuevo producto"/>

    <div class="container-app">
      <form action="#" method="post" @submit.prevent="createProduct">
        <div class="input-group">
          <div>
            <label for="name">Nombre</label>
            <input type="text" name="name" id="name" placeholder="Manzana" 
            v-model="name" 
            @keyup="uppercase" 
            autocomplete="off"
            required>
          </div>
          <div>
            <label for="price">Precio</label>
            <input type="number" name="price" id="price" min="1" value="1" step="0.01" v-model.number="price" required>
          </div>
          <div>
            <label for="measurement_units">Unidad medida</label>
            <select
              name="measurement_units"
              id="measurement_units"
              v-model="measurementUnit"
              required
            >
              <option value selected disabled>Seleccione una...</option>
              <option
                v-for="(unit,index) in measurement_units"
                :key="index"
                :value="unit.id_unit_measurement"
              >{{unit.name}}</option>
            </select>
          </div>
          <div>
            <label for="category">Categoria</label>
            <select name="category" id="category" v-model="category" required>
              <option value selected disabled>Seleccione una...</option>
              <option
                v-for="(category,index) in categories"
                :key="index"
                :value="category.id_category"
              >{{category.name}}</option>
            </select>
          </div>
        </div>
        <div>
          <div style="margin-bottom:10px">
            <strong>Incluir ITBIS</strong>
          </div>
          <div>
            <span style="margin-right:30px;">
              <input type="radio" name="itbis" value="1" id="itebis_si" v-model="itbis" checked>
              &Tab;
              <strong>
                <label for="itebis_si">SI</label>
              </strong>
            </span>
            <span>
              <input type="radio" name="itbis" value="0" id="itebis_no" v-model="itbis">
              &Tab;
              <strong>
                <label for="itebis_no">NO</label>
              </strong>
            </span>
            <div
              class="information"
              style="margin:10px 0px;"
            >El porcentaje de ITBIS se asigna en ajustes.</div>
            <div class="input-group">
              <div>
                <label for="description">Descripción</label>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Agregue aquí una descripción breve, esto es opcional"
                  rows="4"
                  v-model="description"
                ></textarea>
              </div>
            </div>
            <div style="margin-top:20px;margin-bottom:20px;">
              <button class="button primary small" :disabled="name.length == 0">
                <font-awesome-icon icon="save"/>&Tab;Guardar
              </button>
              <button class="button danger small right" @click="$router.push('/product/list')">
                <font-awesome-icon icon="window-close"/>&Tab;Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import MenuComponent from "@/components/TheMenu.vue";
import categories from '@/mixins/miscellany/categories';
import measurementUnits from '@/mixins/miscellany/measurementUnits'
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

export default {
  mixins:[categories,measurementUnits],
  mounted(){
    if(this.online){
      this.requestCategories(axios);
      this.requestMeasurementUnit(axios);
    }
  },
  data() {
    return {
      name: "",
      price: 1,
      measurementUnit: "",
      category: "",
      itbis: "1",
      description: ""
    };
  },
  components: {
    MenuComponent
  },
  computed: {
    ...mapState([
      "measurement_units",
      "categories",
      "user",
      "online",
      "apiDomain"
    ])
  },
  methods: {
    ...mapMutations(["addProduct", "deleteProduct","setCategories","setMeasurementUnit"]),
    createProduct() {
      const notyf = new Notyf();
      let formData = new FormData();
      let product = {
        id_user: this.user.id_user,
        name: this.name,
        price: this.price,
        id_unit_measurement: this.measurementUnit,
        id_category: this.category,
        itbis: this.itbis,
        description: this.description
      };
      formData.append('product',JSON.stringify(product));

      if (this.online) {
        axios
          .post(`${this.apiDomain}/Products/add`, formData)
          .then(response => {
            if (response.data.status == "success") {
              product.id_product = response.data.data.id_product;
              this.addProduct(product);
              notyf.success("Producto guardado!");
              this.name = '';
              document.querySelector('#name').focus();
            }else if(response.data.status == "exits"){
              notyf.error(`Ya existe un producto nombrado: ${response.data.data.name}`);
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
    uppercase(){
      this.name = this.name.toUpperCase();
    }
  }
};
</script>