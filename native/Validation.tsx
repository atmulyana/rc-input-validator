/**
 * https://github.com/atmulyana/rc-input-validator
 */
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {noop} from "javascript-common";
import Rule from '../rules/Rule';
import type {InputRef} from "../types";
import {validationFactory, type HocInput} from '../Validation';
import {Context} from './Context';
import type {StyleProp, ValidationOption} from './types';

const containerStyleProps = new Set([
    'alignSelf',
    'bottom',
    'display',
    'end',
    'flexGrow',
    'flexShrink',
    'flexBasis',
    'left',
    'margin',
    'marginBottom',
    'marginEnd',
    'marginHorizontal',
    'marginLeft',
    'marginRight',
    'marginStart',
    'marginTop',
    'marginVertical',
    'maxWidth',
    'minWidth',
    'position',
    'right',
    'start',
    'top',
    'transform',
    'width',
    'zIndex',
]);

const getStyleDefault: NonNullable<ValidationOption<any>['getStyle']> = props => props.style;
const setStyleDefault: NonNullable<ValidationOption<any>['setStyle']> = (props, style) => props.style = style;
const getValueDefault: NonNullable<ValidationOption<any, any>['getValue']> = props => props.value;

type TStyles = {
    input: {[prop: string]: unknown},
    container: {[prop: string]: unknown},
};

function prepareStyle(s: StyleProp): TStyles {
    const style = StyleSheet.flatten(s) as {[p: string]: unknown};
    const styles: TStyles = {input: {}, container: {}};
    if (style && typeof(style) == 'object') {
        for (let propName in style) {
            if (containerStyleProps.has(propName)) {
                styles.container[propName] = style[propName];
            }
            else {
                styles.input[propName] = style[propName];
            }
        }

        if (typeof styles.input.height == 'string') {
            styles.container.height = styles.input.height;
            delete styles.input.height;
        }
        if (typeof styles.input.minHeight == 'string') {
            styles.container.minHeight = styles.input.minHeight;
            delete styles.input.minHeight;
        }
        if (typeof styles.input.maxHeight == 'string') {
            styles.container.maxHeight = styles.input.maxHeight;
            delete styles.input.maxHeight;
        }
        
        if ((styles.input.flex as any) > 0) {
            styles.container.flex = styles.input.flex;
            delete styles.input.flex;
        }
        if ('height' in styles.container || (styles.container.flex as any) > 0 || 'flexBasis' in styles.container) {
            if (!('height' in styles.input)) styles.input.flex = 1;
        }
    }

    return styles;
}

export function isDifferentStyle(style1: StyleProp, style2: StyleProp): boolean {
    const arStyle1: ReadonlyArray<unknown> = Array.isArray(style1) ? style1 : [style1],
          arStyle2: ReadonlyArray<unknown> = Array.isArray(style2) ? style2 : [style2];
    if (arStyle1.length != arStyle2.length) return true;
    else {
        for (let i = 0; i < arStyle1.length; i++) if (arStyle1[i] !== arStyle2[i]) return true;
        return false;
    }
}

const {withValidation: ___withValidation, Validation} = validationFactory<StyleProp, {[p: string]: any}>(
    () => ({
        Context,
        getStyle: getStyleDefault,
        getValue: getValueDefault,
        setStyle: setStyleDefault,
        isDifferentStyle,
        prepareStyle
    })
);

export function withValidation<Props, Instance = unknown>(
    Input: React.AbstractComponent<Props, Instance>,
    option: ValidationOption<Props, any> | Array<Rule<any>> | Rule<any>
): HocInput<Props, Instance> {
    type TInput = HocInput<Props, Instance>;
    let hocInput!: {current: Nullable<TInput>},
        rules: Rule<any> | Array<Rule<any>> = [],
        opt: ValidationOption<Props, any> = {rules};
    const oriLogError = console.error;
    try {
        console.error = noop;
        hocInput = React.useRef<Nullable<TInput>>(null);
        [opt] = React.useState<ValidationOption<Props, any>>(opt);
    }
    catch { //we know if `React.useState` is used outside a function component then an error will happen because of trying to access the member of `null` object
            //(I don't want to be kicked out because of checking `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current == null`)
            //`hocInput` will be undefined (never be set). If set then it's inside a function component (useful for checking)
    }
    finally {
        console.error = oriLogError;
    }
    
    if (Array.isArray(option) || (option instanceof Rule)) {
        rules = option;
    }
    else {
        rules = option?.rules; //`?.` for runtime check. `option` may not be a non-null object.
                               //NOTE: `?.` operator also applies to non-object variable such as boolean and number 
    }

    if (hocInput?.current) { //inside a function component and the Input wrapper has been created
        opt.rules = rules;
        return hocInput.current;
    }

    if (!(
            rules && (
                (rules instanceof Rule) ||
                (Array.isArray(rules) && rules.filter(rule => rule instanceof Rule).length > 0)
            )
    )) {
        /*There is no validation rule defined, so it's useless if we create an input component with validation attributes.
          Returning the original input component is more sensible.*/
        const Inp = Input as TInput;
        if (hocInput) hocInput.current = Inp; //inside a function component
        return Inp;
    }

    if (Array.isArray(option) || (option instanceof Rule)) {
        Object.assign(opt, {rules});
    }
    else {
        Object.assign(opt, option);
    }

    const Inp = ___withValidation(Input, opt);
    
    //Inside a function component: keep Input for next renders so that need not re-executing `___withValidation`
    if (hocInput) hocInput.current = Inp;
    
    return Inp;
}

export {Validation};