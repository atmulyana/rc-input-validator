/**
 * https://github.com/atmulyana/rc-input-validator
 */
import type {CSSProperties} from "react";
import type {
    ContextProps as GenericContextProps,
    ContextValue as GenericContextValue,
    ValidationOption as GenericValidationOption,
    ValidationProps as GenericValidationProps,
} from "../types";

export type StyleProp = 
    | string
    | CSSProperties
    | {
        $class: string,
        $style: CSSProperties,
    } 
    | null
    | undefined;
export type CompositeStyleProp =
    | {
        $cover: StyleProp,
        $input?: StyleProp,
    }
    | StyleProp;

export type InputValue = string | readonly string[] | number;
export type InputRefValue = InputValue | readonly File[];
export type InputOptions = Array<{value: string, label?: string} | string>;

export type ElementProps<
    Instance = HTMLElement,
    RefValue = unknown,
> = Omit<
    React.DetailedHTMLProps<React.HTMLAttributes<Instance>, Instance>,
    'onChange' | 'ref' | 'style' | 'value'
> & {
    style?: StyleProp,
    value?: RefValue,
};
export type ExcludedPropNames = 'className' | 'style' | 'ref' | 'value';
export type OuterProps<Props extends ElementProps, Value = unknown> = Omit<Props, ExcludedPropNames> & {
    style?: CompositeStyleProp,
    value?: Value,
};

export type ContextProps = GenericContextProps<StyleProp>;
export type ContextValue = GenericContextValue<StyleProp>;
export type ValidationOption<
    Props extends ElementProps<HTMLElement, RefValue>,
    Value = unknown,
    RefValue = Value
> = GenericValidationOption<
    Props,
    StyleProp,
    OuterProps<Props, Value>,
    CompositeStyleProp,
    RefValue
>;
export type ValidationProps = GenericValidationProps<StyleProp>;

export type InputBaseProps<
    Instance extends HTMLElement & {value: RefValue},
    RefValue extends InputRefValue,
> = {
    name?: string,
    onChange?: React.ChangeEventHandler<Instance>,
};
export type InputProps<
    Instance extends HTMLElement & {value: RefValue},
    Props extends ElementProps<Instance, RefValue> & InputBaseProps<Instance, RefValue>,
    Value extends InputValue,
    RefValue extends InputRefValue = Value,
> = {
    Component: React.AbstractComponent<Props, Instance>,
    rules: ValidationOption<Props, any>['rules'],
    settings?: Omit<ValidationOption<Props>, 'getValue' | `getStyle` | 'name' | 'rules' | 'setStyle'>,
} & OuterProps<Props, Value>;