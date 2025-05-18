/**
 * https://github.com/atmulyana/rc-input-validator
 */
import React from 'react';
import {emptyString} from 'javascript-common';
import {setRef} from 'reactjs-common';
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
    InputRefValue,
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

function arrayEqual(ar1: any[], ar2: any[]) {
    if (ar1.length != ar2.length) return false;
    for (let i = 0; i < ar1.length; i++) {
        if (ar1[i] !== ar2[i]) return false;
    }
    return true;
}

export const ValidatedInput = React.forwardRef(function ValidatedInput<
    Instance extends HTMLElement & {value: RefValue},
    Props extends ElementProps<Instance, RefValue> & InputBaseProps<Instance, RefValue>,
    Value extends InputValue = InputValue,
    RefValue extends InputRefValue = Value,
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
    }: InputProps<Instance, Props, Value, RefValue>,
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
    } = props as OuterProps<Props, Value>;

    const state = useState(() => {
        const option: ValidationOption<Props, any> = {
            ...settings,
            name,
            rules,
        };
        return {
            Input: withValidation(Component, option),
            option,
            ref: null as (Instance & InputRef | null)
        };
    });
    state.option.rules = rules;
    const [val, setVal] = React.useState<RefValue | Value | undefined>(value);

    React.useEffect(() => {
        setVal(value);
    }, [value]);

    React.useEffect(() => {
        if (state.ref && (state.ref as any).type != 'file') {
            /**
             * To avoid inconsistency the value of state variable `val` and the actual value of input.
             * It happens when an invalid value is set to `value` prop. For example, when
             *   + an invalid date string is assigned to `<input type='date' />`
             *   + a value is assigned to `<select>` but no matching child `<option>` with the value.
             * In those cases, the input will have an empty string value but state variable `val` still
             * has the invalid value. It will cause the `required` rule has no effect.
             */
            const refVal = state.ref.value;
            let isEqual = arrayEqual(
                Array.isArray(val) ? val : [val],
                Array.isArray(refVal) ? refVal : [refVal]
            );
            if (!isEqual) setVal(refVal);
        }
    }, [val]);

    //@ts-expect-error
    return <state.Input
        {...props2}
        ref={_ref => {
            state.ref = _ref;
            setRef(ref, _ref);
        }}
        name={name}
        value={val ?? emptyString} /* avoids `undefined` to make the input component controlled */
        onChange={ev => {
            setVal(ev.target.value);
            if (onChange) onChange(ev);
        }}
    />;
}) as (
    /**
     * Needs to cast to a Function Component so that the generic type parameters (`Instance`, `Props` and `Value`)
     * have the effect. If not casted, the generic type parmeters are always considered as their base type.
     */
    <
        Instance extends HTMLElement & {value: RefValue},
        Props extends ElementProps<Instance, RefValue> & InputBaseProps<Instance, RefValue>,
        Value extends InputValue = InputValue,
        RefValue extends InputRefValue = Value,
    >(
        props: InputProps<Instance, Props, Value, RefValue> & React.RefAttributes<Instance & InputRef>
    ) => React.ReactNode
);