/**
 * https://github.com/atmulyana/rc-input-validator
 */
import type {Rule} from '../types';
import messages from '../messages';
import ValidationRule from './ValidationRule';

export class Numeric extends ValidationRule<string, number> {
    static regex: RegExp = /^(\+|-)?(\d+(\.\d+)?|\.\d+)$/;
    
    get errorMessage() {
        return this.lang(messages.numeric);
    }
    
    get resultValue() {
        return parseFloat(this.value);
    }
    
    validate(): Rule<string, number> {
        this.isValid = Numeric.regex.test(this.value);
        return this;
    }
}

export const numeric: Rule<string, number> = new Numeric();
numeric.setMessageFunc = function() {
    throw new Error("`numeric` rule object is shared among inputs. If you want to set message function, use `new Numeric()` instead.");
};
numeric.setPriority = function() {
    throw new Error("`numeric` rule object is shared among inputs. If you want to set priority, use `new Numeric()` instead.");
};