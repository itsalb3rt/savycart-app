const snackbar = {
  namespaced: true,
  state: {
    snackbar: {
      show: false,
      message: "",
      color: "",
      top: null,
      bottom: null,
      multiLine: true
    }
  },
  mutations: {
    setSnackbar(state, snackbar) {
      state.snackbar.show = snackbar.show;
      state.snackbar.message = snackbar.message;
      state.snackbar.color = snackbar.color;
      state.snackbar.top = snackbar.top === undefined ? null : snackbar.top;
      state.snackbar.bottom =
        snackbar.bottom === undefined ? null : snackbar.bottom;
      setTimeout(() => {
        state.snackbar.show = false;
      }, 5000);
    },
    setSnackbarShow(state, value) {
      state.snackbar.show = value;
    }
  }
};

export default snackbar;
