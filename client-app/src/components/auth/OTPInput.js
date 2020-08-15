import { useCallback, memo, useRef, useEffect } from "react";
import { TextField, Grid } from "@material-ui/core";
import React from 'react';
import { SingleOTPInput } from "./SingleOTPInput";



export const OTPInputComponent = (props) => {
    const { length, disabled, onChangeOTP, inputClassName, inputStyle, autoFocus, hidden } = props;
    const [ activeInput, setActiveInput ] = React.useState(0);
    const [ otpValues, setOTPValues ] = React.useState(new Array(length).fill(''));
    const handleOTPChange = useCallback((otp) => {
        const otpVal = otp.join('');
        onChangeOTP(otpVal);
    },[onChangeOTP]);

    const changeCodeAtFocus = useCallback((str) => {
        const updatedOTPVal = [...otpValues];
        updatedOTPVal[activeInput] = parseInt(str[str.length-1]) || '';
        setOTPValues(updatedOTPVal);
        handleOTPChange(updatedOTPVal);
    },[activeInput, handleOTPChange, otpValues]);

    const focusInput = useCallback((inputIndex) => {
        const selectedIndex = Math.max(Math.min(length - 1, inputIndex), 0);
        setActiveInput(selectedIndex);
    },[length]);

    const focusPrevInput = useCallback(() => {
        focusInput(activeInput - 1);
    },[activeInput, focusInput]);
    
    const focusNextInput = useCallback(() => {
        focusInput(activeInput + 1);
    },[activeInput, focusInput]);

    const handleOnFocus = useCallback(index => {
        focusInput(index)
    },[focusInput]);

    const handleOnChange = useCallback(e => {
        const val = e.currentTarget.value;
        if(!val){
            e.preventDefault();
            return;
        }
        changeCodeAtFocus(val);
        focusNextInput();
    },[changeCodeAtFocus, focusNextInput]);

    const handleOnBlur = useCallback(() => {
        setActiveInput(-1);
    });

    const handleOnKeyDown = useCallback(e => {
        switch(e.key){
            case 'Delete':
            case 'Backspace':
                e.preventDefault();
                if(otpValues[activeInput])
                    changeCodeAtFocus('');
                else 
                    focusPrevInput();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                focusPrevInput();
                break;
            case 'Tab':
            case 'ArrowRight':
                e.preventDefault();
                focusNextInput();
                break;
            case ' ':
                e.preventDefault();
                break;
            default:
                break;
        }
    },[activeInput, changeCodeAtFocus, focusNextInput, focusPrevInput, otpValues]);

    return(
        <div>
            {Array(length)
                .fill('')
                .map((ix,inx) => (
                    <Grid item xs={12/length} key={`SingleInput-${inx}`} hidden={hidden}>
                        <SingleOTPInput
                            focused={activeInput === inx}
                            hidden={hidden}
                            autoFocus={autoFocus}
                            value={otpValues && otpValues[inx]}
                            onFocus={() => handleOnFocus(inx)}
                            onChange={handleOnChange}
                            onKeyDown={handleOnKeyDown}
                            onBlur={handleOnBlur}
                            fullWidth
                            style={inputStyle}
                            className={inputClassName}
                            disabled={disabled}
                        />
                    </Grid>
                ))}
        </div>
    )
}

const OTPInput = memo(OTPInputComponent);
export default OTPInput;