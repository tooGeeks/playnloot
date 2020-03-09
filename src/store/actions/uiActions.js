export const showSnackbar = (param) => {
    return dispatch => {
        dispatch({type: "SNACKBAR", variant: param.variant, message: param.message});
    };
};

export const clearSnackbar = () => {
    return dispatch => {
        dispatch({type: "SNACKBAR_CLEAR"})
    }
}

export const backDrop = () => {
    return dispatch => {
        dispatch({type: "BACKDROP"});
    };
}
export const clearBackDrop = () => {
    return dispatch => {
        dispatch({type: "BACKDROP_CLEAR"});
    };
}