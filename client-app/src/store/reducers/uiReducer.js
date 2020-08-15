const initState = {
  backDropOpen: false, 
  SnackbarVariant: 'info', 
  DialogOpen: false,
  ATHSOpen:{prompt:()=>{console.log("Not Set")}},
  isAppInstalled:true,
  shareTitle: 'PlayNLoot: Participare/Host PUBG Matches and earn!',
  shareText: 'Hey, check this platform for gamers to play and win prizes! You can host a match and distribute prizes too!',
  shareUrl: 'https://playandloot.web.app'
}
const uiReducer = (state = initState, action) => {
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
        case 'WEB_SHARE':
          return {
            ...state,
            shareTitle: action.shareTitle,
            shareText: action.shareText,
            shareUrl: action.shareUrl
          }
       default:
        return state;
    }
  };
  
  export default uiReducer;