export default {
  methods: {
    requestMeasurementUnit(axios) {
      axios
        .get(
          `${this.apiDomain}/Miscellany/measurementUnits/${this.user.id_user}`
        )
        .then(response => {
          //Mutation
          this.setMeasurementUnit(response.data);
        })
        .catch(function (error) {
          console.log("TCL: deleteMeasurementUnit -> error", error);
        });
    }
  }
};