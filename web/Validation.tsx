/**
 * https://github.com/atmulyana/rc-input-validator
 */
import React from 'react';
import {emptyString} from 'javascript-common';
import {useState} from '../helpers';
import type {InputRef} from "../types";
import {validationFactory} from '../Validation';
import {Context} from './Context';
import {
    defaultStyle,
    getStyleProps,
} from './helpers';
import type {
    CompositeStyleProp,
    ElementProps,
    ExcludedPropNames,
    InputBaseProps,
    InputProps,
    InputValue,
    OuterProps,
    StyleProp,
    ValidationOption,
} from './types';

const getStyleDefault: NonNullable<ValidationOption<ElementProps>['getStyle']> = props => props.style;
const setStyleDefault: NonNullable<ValidationOption<any>['setStyle']> = (props, style) => Object.assign(props, getStyleProps(style));
const getValueDefault: NonNullable<ValidationOption<any, any>['getValue']> = props => props.value;

type TStyles = Extract<CompositeStyleProp, {$cover: any, $input?: any}>;

function prepareStyle(s: CompositeStyleProp) {
    let styles: TStyles;
    if (s && typeof(s) == 'object' && ('$cover' in s)) styles = s;
    else {
        styles = {
            $cover: defaultStyle.container,
            $input: s,
        }
    }
    return {
        container: styles.$cover,
        input: styles.$input,
    };
}

export function isDifferentStyle(style1: CompositeStyleProp, style2: CompositeStyleProp): boolean {
    if (
        style1 && typeof(style1) == 'object' && '$cover' in style1 &&
        style2 && typeof(style2) == 'object' && '$cover' in style2
    ) {
        return style1.$cover != style2.$cover || style1.$input != style2.$input;
    }
    return style1 != style2;
}

const {withValidation, Validation} = validationFactory<StyleProp, StyleProp, CompositeStyleProp, ExcludedPropNames>(
    () => ({
        Context,
        getStyle: getStyleDefault,
        getValue: getValueDefault,
        setStyle: setStyleDefault,
        isDifferentStyle,
        prepareStyle
    })
);

export {Validation};

export const ValidatedInput = React.forwardRef(function ValidatedInput<
    Instance extends HTMLElement,
    Props extends ElementProps & InputBaseProps<Instance, Value>,
    Value extends InputValue = InputValue,
>(
    {
        Component,
        rules,
        settings,
        // value,
        // onChange,
        // name,
        // defaultValue,
        // defaultChecked,
        ...props
    }: InputProps<Instance, Props, Value>,
    ref: React.Ref<Instance & InputRef>
) {
    const {
        value,
        onChange,
        name,
        defaultValue,
        defaultChecked,
        ...props2
    //@ts-expect-error: it should be `OuterProps` because `InputProps = {Component, rules, settings} & OuterProps`
    } = props as OuterProps<Props>;

    const [Input, option] = useState(() => {
        const option: ValidationOption<Props, any> = {
            ...settings,
            name,
            rules,
        };
        return [withValidation(Component, option), option];
    });
    option.rules = rules;
    const [val, setVal] = React.useState<Value | undefined>(value);

    React.useEffect(() => {
        setVal(value);
    }, [value]);

    //@ts-expect-error
    return <Input
        {...props2}
        ref={ref}
        name={name}
        value={val ?? emptyString} /* avoids `undefined` to make the input component controlled */
        onChange={ev => {
            setVal(ev.target.value);
            if (onChange) onChange(ev);
        }}
    />;
});