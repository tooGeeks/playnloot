const uiReducer = (state = {backDropOpen: false, SnackbarVariant: 'info'}, action) => {
    switch (action.type) {
      case "SNACKBAR":
        return {
          ...state,
          SnackbarOpen: true,
          SnackbarVariant: action.variant,
          SnackbarMessage: action.message
        };
      case "SNACKBAR_CLEAR":
        return {
          ...state,
          SnackbarOpen: false,
          /*
          successSnackbarOpen: false,
          errorSnackbarOpen: false,
          infoSnackbarOpen: false
          */
        };
        case "BACKDROP":
          return {
            ...state,
            backDropOpen: true,
          };
        case "BACKDROP_CLEAR":
          return {
            ...state,
            backDropOpen: false,
          };
      default:
        return state;
    }
  };
  
  export default uiReducer;