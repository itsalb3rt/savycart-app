export default {
  methods: {
    getDate(timestamp) {
      if (!timestamp) {
        return timestamp;
      }
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat().format(date);
    }

  }
}