/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {emptyString} from "javascript-common";
import type {Rule, StrLengthType} from '../types';
import messages from '../messages';
import ValidationRule from './ValidationRule';

export class StrLength extends ValidationRule<StrLengthType> {
    constructor(min?: number, max?: number) {
        super();
        this.min = min;
        this.max = max;
    }

    min: number | undefined;
    max: number | undefined;

    #message: Nullable<string>;
    get errorMessage() {
        return this.#message;
    }

    validate(): Rule<StrLengthType> {
        this.#message = emptyString;
        var strVal = this.value+emptyString;
        if (this.min !== undefined && strVal.length < this.min) this.#message = this.lang(messages.strlenmin);
        if (this.max !== undefined && strVal.length > this.max) this.#message = this.lang(messages.strlenmax);
        this.isValid = !this.#message;
        return this;
    }
}
export const strlen = (min: number, max?: number): StrLength => new StrLength(min, max);
export const strlenmax = (max: number): StrLength => new StrLength(undefined, max);
