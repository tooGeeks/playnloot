const uiReducer = (state = {backDropOpen: false, SnackbarVariant: 'info', DialogOpen: false,ATHSOpen:{prompt:()=>{console.log("Not Set")}},isAppInstalled:true}, action) => {
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
        case "DIALOG":
          return {
            ...state,
            DialogOpen: true,
            DialogTitleParam: action.title,
            DialogContentParam: action.content,
            DialogActionsParam: action.actions
          };
        case "DIALOG_CLEAR":
          return {
            ...state,
            DialogOpen: false
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
        case 'INSTALLAPP_SETATHS':
          return {
            ...state,
            ATHSOpen:action.ATHSOpen
          }
        case "INSTALLAPP_OPEN":
          console.log(state.ATHSOpen)
          state.ATHSOpen.prompt();
          return state;
        case 'APP_INSTALLED':
          return {...state,isAppInstalled:action.val}
       default:
        return state;
    }
  };
  
  export default uiReducer;