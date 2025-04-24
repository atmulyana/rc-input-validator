/**
 * https://github.com/atmulyana/rc-input-validator
 */
import type {Rule} from '../types';
import messages from '../messages';
import ValidationRule from './ValidationRule';

const regex: RegExp = /^(\+|-)?(\d+(\.\d+)?|\.\d+)$/;
export class Numeric extends ValidationRule<string, number> {
    static get regex() {
        return regex;
    }
    
    get errorMessage() {
        return this.lang(messages.numeric);
    }
    
    get resultValue() {
        return parseFloat(this.value);
    }
    
    validate(): Rule<string, number> {
        this.isValid = regex.test(this.value);
        return this;
    }
}

export const numeric: Rule<string, number> = new Numeric();
numeric.setMessageFunc = function() {
    throw new Error("`numeric` rule object is shared among inputs. If you want to set message, use `new Numeric()` instead.");
};
numeric.setPriority = function() {
    throw new Error("`numeric` rule object is shared among inputs. If you want to set priority, use `new Numeric()` instead.");
};