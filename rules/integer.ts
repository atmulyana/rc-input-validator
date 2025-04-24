/**
 * https://github.com/atmulyana/rc-input-validator
 */
import type {Rule} from '../types';
import messages from '../messages';
import ValidationRule from './ValidationRule';
 
export class Integer extends ValidationRule<unknown> {
    constructor() {
        super();
        this.setPriority(1);
    }

    get errorMessage() {
        return this.lang(messages.integer);
    }

    validate(): Rule<unknown> {
        this.isValid = Number.isInteger(this.value);
        return this;
    }
}

export const integer: Rule<unknown> = new Integer();
integer.setMessageFunc = function() {
    throw new Error("`integer` rule object is shared among inputs. If you want to set message, use `new Integer()` instead.");
};
integer.setPriority = function() {
    throw new Error("`integer` rule object is shared among inputs. If you want to set priority, use `new Integer()` instead.");
};