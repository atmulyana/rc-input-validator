/**
 * https://github.com/atmulyana/rc-input-validator
 */
import type {
    ContextValue as GlobalContextValue,
    ValidationOption as GlobalValidationOption,
    ValidationProps as GlobalValidationProps,
} from "../types";

type Falsy = undefined | null | false | "";
interface RecursiveArray<T> extends Array<T | Array<T> | RecursiveArray<T>> {}
interface AnyInterface {}
export type StyleProp<T = Readonly<{[p: string]: unknown}> | AnyInterface > =
    | T
    | RecursiveArray<T | Falsy>
    | Falsy;

export type ContextValue = GlobalContextValue<StyleProp>;
export type ValidationOption<Props, Value = unknown> = GlobalValidationOption<Props, StyleProp, Value>;
export type ValidationProps = GlobalValidationProps<StyleProp>;