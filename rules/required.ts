/**
 * https://github.com/atmulyana/rc-input-validator
 */
import type {Rule} from '../types';
import {isFilled} from '../helpers';
import messages from '../messages';
import ValidationRule from './ValidationRule';

export class Required extends ValidationRule<unknown> {
    constructor(_if?: (p: unknown) => boolean) {
        super();
        this.#if = _if;
    }

    static If(_if: (p: unknown) => boolean): Required {
        return new Required(_if);
    }

    #if: Nullable<((p: unknown) => boolean)>;

    get priority() {return -Number.MAX_VALUE}

    get errorMessage() {
        return this.lang(messages.required);
    }

    // get resultValue() {
    //     return typeof(this.value) == 'string' ? this.value.trim() : this.value;
    // }

    validate(): Rule<unknown> {
        if (typeof this.#if == 'function') {
            if (this.#if(this.value)) this.isValid = isFilled(this.value);
            else this.isValid = true;
        }
        else {
            this.isValid = isFilled(this.value);
        }
        return this;
    }
}

class RequiredIf extends Required {
    if: ((p1: (p2: unknown) => boolean) => Required) = Required.If.bind(null);
}

export const required: RequiredIf = new RequiredIf();
required.setMessageFunc = function() {
    throw new Error("`required` rule object is shared among inputs. If you want to set message function, use `new Required()` instead.");
}

const isFalse = () => false;
export const alwaysValid: Required = Required.If(isFalse);