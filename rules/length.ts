/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {emptyString} from "javascript-common";
import type {Rule, LengthType} from '../types';
import messages from '../messages';
import ValidationRule from './ValidationRule';

export class Length extends ValidationRule<LengthType> {
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

    validate(): Rule<LengthType> {
        this.#message = emptyString;
        var val: {length: number} = typeof(this.value) == 'number' ? this.value+emptyString : this.value;
        if (this.min !== undefined && val.length < this.min) this.#message = this.lang(messages.lengthMin);
        if (this.max !== undefined && val.length > this.max) this.#message = this.lang(messages.lengthMax);
        this.isValid = !this.#message;
        return this;
    }
}
export const length = (min: number, max?: number): Length => new Length(min, max);
export const lengthMax = (max: number): Length => new Length(undefined, max);