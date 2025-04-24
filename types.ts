/**
 * https://github.com/atmulyana/rc-input-validator
 */
import React from 'react';
             
import type Rule from './rules/Rule';
export type {Rule};

export type LangFunction = (s: string) => string;
export type ValidateFunction<T> = (v: T) => boolean | string;
export type ValidateFunctionAsync<T> = (value: T, resolve: (result: boolean | string) => void) => void;
export type MessageFunction<T, V> = Nullable< (rule: Rule<T, V>) => Nullable<string> >;
export type ComparableType = number | string | bigint | Date;
export type LengthType = {length: number} | number;

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

type TAsyncFailMessage = {
    Default: 0,
    CaughtError: 1,
};
export const AsyncFailMessage: TAsyncFailMessage = Object.freeze({
    Default: 0,
    CaughtError: 1,
});

export interface ContextDefaultProps<StyleProps> {
    asyncFailMessage: TAsyncFailMessage[keyof TAsyncFailMessage],
    auto: boolean,
    Container: React.ComponentType<{style?: StyleProps, children?: React.ReactNode}>,
    ErrorText: React.ComponentType<{
        style?: [
            StyleProps | undefined,
            StyleProps | undefined,
        ] | StyleProps,
        children?: React.ReactNode,
    }>,
    errorTextStyle: StyleProps,
    focusOnInvalid: boolean,
    inputErrorStyle: StyleProps,
    lang: LangFunction,
};

export interface ContextProps<StyleProps> extends ContextDefaultProps<StyleProps> {
    children: React.ReactNode,
};

export interface ContextValue<StyleProps> extends ContextDefaultProps<StyleProps> {
    readonly nextIndex: number,
    addRef: (ref: InputRef) => unknown,
    removeRef: (ref: InputRef) => unknown,
};

export type ValidationOption<Props, StyleProps, OuterProps = Props, CompositeStyleProps = StyleProps, Value = unknown> = {
    asyncFailMessage?: ContextValue<StyleProps>['asyncFailMessage'],
    auto?: boolean,
    Container?: ContextValue<StyleProps>['Container'],
    ErrorText?: ContextValue<StyleProps>['ErrorText'],
    errorTextStyle?: ContextValue<StyleProps>['errorTextStyle'],
    getStyle?: (props: OuterProps) => CompositeStyleProps,
    getValue?: (props: Props) => Value,
    inputErrorStyle?: ContextValue<StyleProps>['inputErrorStyle'],
    lang?: LangFunction,
    name?: string,
    rules: Array<Rule<Value>> | Rule<Value>,
    setStatusStyle?: (
        props: Props,
        style: Nullable<[StyleProps | undefined, StyleProps | undefined]> | false,
        context: {
            clearValidation: () => void,
            flag: any,
            normalStyle?: StyleProps, 
        }
    ) => React.ReactNode,
    setStyle?: (
        props: Props,
        style?: StyleProps | Array<StyleProps | undefined>,
        container?: {
            style?: StyleProps,
        }
    ) => unknown,
};

export type ValidationProps<StyleProps, CompositeStyleProps = StyleProps> = {
    auto?: boolean,
    Container?: ContextValue<StyleProps>['Container'],
    ErrorText?: ContextValue<StyleProps>['ErrorText'],
    errorTextStyle?: StyleProps,
    lang?: LangFunction,
    rules: Array<Rule> | Rule,
    style?: CompositeStyleProps,
    value: unknown,
};

export type HttpReqOption = {
    data?: URLSearchParams | {[prop: string]: unknown},
    headers?: {[name: string]: string},
    silentOnFailure?: boolean,
    timeout?: number,
    withCredentials?: boolean,
};