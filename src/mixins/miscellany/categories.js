export default {
    methods: {
        requestCategories(axios) {
            axios
                .get(
                    `${this.apiDomain}/Miscellany/categories/${this.user.id_user}`
                )
                .then(response => {
                    this.setCategories(response.data);
                })
                .catch(function (error) {
                    console.log("TCL: deleteMeasurementUnit -> error", error);
                });
        }
    }
};