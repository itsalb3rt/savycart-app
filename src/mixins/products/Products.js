export default {
    methods: {
      requestProducts() {
        return this.axios.get( `${this.apiDomain}/products/list/${this.user.id_user}`);
      }
    }
  };