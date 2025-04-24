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
    else if (Array.isArray(value)) {
        if (value.length == 1) return isFilled(value[0]);
        return value.length > 0;
    }
    else {
        return value !== undefined && value !== null;
    }
}

//We use a function (`getValue`), not just a `value` because to get the value, it needs a not simple process.
//So, it's better to get (calculate) the value when only it's needed (at the first render).
export function useState<T>(getValue: () => T): T {
    const state = useRef<T | undefined>(void(0));
    if (state.current === undefined) {
        state.current = getValue();
    }
    return state.current;
}