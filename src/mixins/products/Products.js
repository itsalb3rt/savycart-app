export default {
    methods: {
      requestProducts(axios) {
        return axios.get( `${this.apiDomain}/products/list/${this.user.id_user}`);
      }
    }
  };