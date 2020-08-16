import React, { useRef, useEffect, useLayoutEffect } from 'react'
import { TextField } from '@material-ui/core';

export const SingleOTPInput = (props) => {
    const { focus, autoFocus, ...rest} = props;
    const inputRef = useRef(null);
    const prevFocus = usePrevious(!!focus);
    useLayoutEffect(() => {
        if(inputRef.current){
            if(focus && autoFocus){
                inputRef.current.focus();
            }
            if(focus && autoFocus && focus !== prevFocus){
                inputRef.current.focus();
                inputRef.current.select();
                console.log(inputRef.current);
            }
        }
    },[autoFocus, focus, prevFocus]); 
    return (
        <TextField
            inputProps={{style:{textAlign:'center'}}}
            ref={inputRef}
            fullWidth
            {...rest}
        />
    )
}


const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    },[value]);

    return ref.current;
}