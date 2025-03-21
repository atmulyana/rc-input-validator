/**
 * https://github.com/atmulyana/rc-input-validator
 */
import React from 'react';
             
import type IRule from './rules/Rule';
export type Rule<T = unknown, V = any> = IRule<T, V>;

export type LangFunction = (s: string) => string;
export type ValidateFunction<T> = (v: T) => boolean | string;
export type ValidateFunctionAsync<T> = (value: T, resolve: (result: boolean | string) => void) => void;
export type MessageFunction<T, V> = Nullable< (rule: Rule<T, V>) => Nullable<string> >;
export type ComparableType = number | string | bigint | Date;
export type StrLengthType = string | number;

export interface Ref {
    clearValidation(): void,
    readonly isValid: boolean,
    validate(): boolean,
    validateAsync(): Promise<boolean>,
}

export interface ContextRef extends Ref {
    getErrorMessage(name: string): string | void,
    getInput(name: string): InputRef | void,
    refreshMessage(): void,
    setErrorMessage(name: string, message: string): void,
}

export interface InputRef extends Ref {
    focus?: () => unknown,
    getErrorMessage: () => string,
    readonly index: number,
    readonly name?: string,
    setErrorMessage(message: string): void,
}

export type RefProp<T> = Exclude<React.Ref<T>, null>;

type TAsyncFailMessage = {
    Default: 0,
    CaughtError: 1,
};
export const AsyncFailMessage: TAsyncFailMessage = Object.freeze({
    Default: 0,
    CaughtError: 1,
});

export type ContextValue<StyleProps> = {
    asyncFailMessage: TAsyncFailMessage[keyof TAsyncFailMessage],
    auto: boolean,
    Container: React.ComponentType<{style?: StyleProps, children?: React.ReactNode}>,
    errorTextStyle: StyleProps,
    focusOnInvalid: boolean,
    inputErrorStyle: StyleProps,
    lang?: LangFunction,
    readonly nextIndex: number,
    addRef: (ref: InputRef) => unknown,
    removeRef: (ref: InputRef) => unknown;
};

export type ContextProps<StyleProps> = {
    asyncFailMessage: ContextValue<StyleProps>['asyncFailMessage'],
    auto: ContextValue<StyleProps>['auto'],
    children: React.ReactNode,
    Container: ContextValue<StyleProps>['Container'],
    errorTextStyle: ContextValue<StyleProps>['errorTextStyle'],
    focusOnInvalid: ContextValue<StyleProps>['focusOnInvalid'],
    inputErrorStyle: ContextValue<StyleProps>['inputErrorStyle'],
    lang: NonNullable<ContextValue<StyleProps>['lang']>,
};

export type ContextDefaultProps<StyleProps> = {
    asyncFailMessage: ContextProps<StyleProps>['asyncFailMessage'],
    auto: ContextProps<StyleProps>['auto'],
    Container: ContextProps<StyleProps>['Container'],
    errorTextStyle: ContextProps<StyleProps>['errorTextStyle'],
    focusOnInvalid: ContextProps<StyleProps>['focusOnInvalid'],
    inputErrorStyle: ContextProps<StyleProps>['inputErrorStyle'],
    lang: ContextProps<StyleProps>['lang'],
};

export type ValidationOption<Props, StyleProps, Value = unknown> = {
    asyncFailMessage?: ContextValue<StyleProps>['asyncFailMessage'],
    auto?: boolean,
    Container?: ContextValue<StyleProps>['Container'],
    errorTextStyle?: StyleProps,
    getStyle?: (props: Props) => StyleProps,
    getValue?: (props: Props) => Value,
    inputErrorStyle?: StyleProps,
    lang?: LangFunction,
    name?: string,
    rules: Array<Rule<Value>> | Rule<Value>,
    setStatusStyle?: (props: Props, style: StyleProps, context: {clearValidation: () => void, flag: unknown}) => React.ReactNode,
    setStyle?: (props: Props, style: StyleProps, containerStyle?: StyleProps) => unknown,
};

export type ValidationProps<StyleProps> = {
    auto?: boolean,
    Container?: ContextValue<StyleProps>['Container'],
    errorTextStyle?: StyleProps,
    lang?: LangFunction,
    rules: Array<Rule> | Rule,
    style?: StyleProps,
    value: unknown,
};

export type HttpReqOption = {
    data?: URLSearchParams | {[prop: string]: unknown},
    headers?: {[name: string]: string},
    silentOnFailure?: boolean,
    timeout?: number,
    withCredentials?: boolean,
};