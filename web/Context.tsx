/**
 * https://github.com/atmulyana/rc-input-validator
 */
import React from 'react';
import {defaultStyle, getStyleProps} from './helpers';
import type {ContextValue, StyleProp} from './types';
import {contextFactory} from '../Context';

function Container(props: React.ComponentProps<ContextValue['Container']>) {
    return <div role='validated-input-container' {...getStyleProps([defaultStyle.container, props.style])}>{props.children}</div>;
}

function ErrorText({children, style}: React.ComponentProps<ContextValue['ErrorText']>) {
    return <span role='error-message' {...getStyleProps(style)}>{children}</span>;
}

const {Context, ValidationContext} = contextFactory<StyleProp>({
    Container,
    ErrorText,
    errorTextStyle: defaultStyle.errorText,
    inputErrorStyle: defaultStyle.inputError,
});
export {Context, ValidationContext};
