<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card flat>
          <v-card-text>
            <form @submit.prevent="createCategory">
              <p>{{ $t('category.category_description_section') }}</p>
              <v-text-field
                name="name"
                :label=" $t('category.category') "
                id="name"
                v-model="name"
                :placeholder=" $t('category.category_placeholder') "
                autocomplete="off"
                @keyup="uppercase"
              ></v-text-field>
              <v-btn color="primary" type="submit" class="ml-0" :disabled="name.length == 0">
                <v-icon class="mr-2">fa-save</v-icon>{{ $t('call_action_buttons.save') }}
              </v-btn>
            </form>
            <v-layout row wrap>
              <v-flex xs12>
                <h4>{{ $t('category.registered_categories') }}</h4>
              </v-flex>
              <v-flex xs12>
                <v-data-table :headers="headers" :items="categories">
                  <template v-slot:no-data>
                    <v-alert
                      :value="true"
                      color="error"
                      icon="fa-warning"
                    >{{ $t('messages.nothing_to_display') }}</v-alert>
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
                        @click="dispatchDeleteCategory(category.index)"
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
      <v-dialog v-model="showDialogDeleteCategory" persistent full-width>
        <v-card>
          <v-card-title class="headline">{{ $t('call_action_buttons.delete') }} {{ $t('category.category') }}</v-card-title>
          <v-card-text>{{ $t('messages.confirm_delete_message') }} {{ $t('category.category') }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="deleteCategory()">{{ $t('call_action_buttons.delete') }}</v-btn>
            <v-btn color="primary" flat @click="showDialogDeleteCategory = false">{{ $t('messages.keep') }}</v-btn>
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
import categories from "@/mixins/miscellany/categories";
import axios from "axios";

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
        { text: this.$t('category.name'), value: "nombre" },
        { text: this.$t('call_action_buttons.action'), value: "accion" }
      ],
      snackbarShow: false,
      snackbarMessage: "",
      snackbarColor: "",
      snackbarMultiLine: true,
      showDialogDeleteCategory: false,
      indexCategoryForDelete: ""
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
              this.snackbarShow = true;
              this.snackbarMessage = this.$t('messages.save');
              this.snackbarColor = "success";
            }
          })
          .catch(function(error) {
            console.log("TCL: createCategory -> error", error);
          });
      } else {
        this.snackbarShow = true;
        this.snackbarMessage = this.$t('messages.intenet_required');
        this.snackbarColor = "error";
      }
    },
    dispatchDeleteCategory(index) {
      this.showDialogDeleteCategory = true;
      this.indexCategoryForDelete = index;
    },
    deleteCategory() {
      if (this.online) {
        axios
          .get(
            `${this.apiDomain}/Miscellany/deleteCategory/${this.categories[this.indexCategoryForDelete].id_category}`
          )
          .then(response => {
            if (response.data.status == "success") {
              this.removeCategory(this.indexCategoryForDelete);
              this.snackbarShow = true;
              this.snackbarMessage = this.$t('call_action_buttons.delete');
              this.snackbarColor = "success";
            } else if (response.data.status == "hasDependency") {
              this.snackbarShow = true;
              this.snackbarMessage = this.$t('category.forbiden_delete');
              this.snackbarColor = "error";
            }
          })
          .catch(function(error) {
            console.log("TCL: deleteCategory -> error", error);
          });
      } else {
        this.snackbarShow = true;
        this.snackbarMessage = this.$t('messages.intenet_required');
        this.snackbarColor = "error";
      }
      this.showDialogDeleteCategory = false;
    },
    uppercase() {
      this.name = this.name.toUpperCase();
    }
  }
};
</script>