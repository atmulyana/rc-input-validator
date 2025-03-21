/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {useRef} from 'react';
import {emptyString} from 'javascript-common';
import Rule from '../rules/Rule';

const reVarNameHolders = /\$\{([_a-zA-Z][_a-zA-Z0-9]*)\}/g;
const dontReadRuleMembers = {errorMessage: 1, lang: 1, messageFunc: 1, setMessageFunc: 1, setName: 1, setPriority: 1, setValue: 1, validate: 1};
export interface FreeObject {
    readonly [key: string]: unknown
}
export const str = (template: Nullable<string>, params: FreeObject): Nullable<string> => template &&
    template.replace(reVarNameHolders, function(_, p1: string): string {
        let value: any = params[p1];
        if (params instanceof Rule) {
            if (p1 in dontReadRuleMembers) value = emptyString;
            else if (typeof value == 'function') try { value = value(); } catch{}
        }
        if (value !== null && value !== undefined && typeof value != 'function') return value + emptyString;
        return emptyString;
    });

export function isFilled(value: unknown): boolean {
    if (typeof(value) == 'string') {
        return !!value.trim();
    }
    else {
        return value !== undefined && value !== null;
    }
}

export function useState<T>(getValue: () => T): T {
    const state = useRef<T | undefined>(void(0));
    if (state.current === undefined) {
        state.current = getValue();
    }
    return state.current;
}