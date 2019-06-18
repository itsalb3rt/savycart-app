const plugin = (store) => {
    store.subscribe((mutation, state) => {
      switch (mutation.type) {
        case '...':
          // dispatch request
          break;
        case '...':
          // dispatch request
          break;  
        default:
        // Ignore default case
      }
    });
  };
  
  export default plugin;