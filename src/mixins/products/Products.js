export default {
    methods: {
      requestProducts(axios) {
        axios
          .get(
            `${this.apiDomain}/products/list/${this.user.id_user}`
          )
          .then(response => {
            this.setProducts(response.data);
          })
          .catch(function (error) {
            console.log("TCL: requestProducts -> error", error);
          });
      }
    }
  };