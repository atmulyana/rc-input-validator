/**
 * Example of how to use rc-input-validator package
 * https://github.com/atmulyana/rc-input-validator
 */
import React from 'react';
import type {ContextProps} from 'rc-input-validator/web';

function InputContainer({children}: {children?: React.ReactNode}) {
    return children;
}

export const contextProps: Partial<ContextProps> = {
    Container: InputContainer,
    errorTextStyle: 'text-danger',
    inputErrorStyle: 'border-danger text-danger',
}