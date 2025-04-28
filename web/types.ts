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

export type ElementProps<Instance = HTMLElement> = Omit<
    React.DetailedHTMLProps<React.HTMLAttributes<Instance>, Instance>,
    'onChange' | 'ref' | 'style'
> & {style?: StyleProp};
export type ExcludedPropNames = 'className' | 'style';
export type OuterProps<Props extends ElementProps> = Omit<Props, ExcludedPropNames> & {style?: CompositeStyleProp};

export type ContextProps = GenericContextProps<StyleProp>;
export type ContextValue = GenericContextValue<StyleProp>;
export type ValidationOption<
    Props extends ElementProps,
    Value = unknown
> = GenericValidationOption<
    Props,
    StyleProp,
    OuterProps<Props>,
    CompositeStyleProp,
    Value
>;
export type ValidationProps = GenericValidationProps<StyleProp>;

export type InputValue = string | readonly string[] | number | readonly File[];
export type InputOptions = Array<{value: string, label?: string} | string>;
export type InputBaseProps<
    Instance extends HTMLElement & {value?: any},
    Value extends InputValue
> = {
    name?: string,
    onChange?: React.ChangeEventHandler<Instance & {value?: Value}>,
    value?: Value,
};
export type InputProps<
    Instance extends HTMLElement & {value?: any},
    Props extends ElementProps & InputBaseProps<Instance, Value>,
    Value extends InputValue,
> = {
    Component: React.AbstractComponent<Props, Instance>,
    rules: ValidationOption<Props, any>['rules'],
    settings?: Omit<ValidationOption<Props>, 'getValue' | `getStyle` | 'name' | 'rules'>,
} & OuterProps<Props>;