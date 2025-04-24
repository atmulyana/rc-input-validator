/**
 * https://github.com/atmulyana/rc-input-validator
 */
import type {Rule} from '../types';
import messages from '../messages';
import ValidationRule from './ValidationRule';

const regex: RegExp = /^([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
export class Email extends ValidationRule<string, string> {
    static get regex() {
        return regex;
    }
    
    get errorMessage() {
        return this.lang(messages.email);
    }
    
    validate() {
        this.isValid = regex.test(this.value);
        return this;
    }
}

export const email: Rule<string, string> = new Email();
email.setMessageFunc = function() {
    throw new Error("`email` rule object is shared among inputs. If you want to set message, use `new Email()` instead.");
};
email.setPriority = function() {
    throw new Error("`email` rule object is shared among inputs. If you want to set priority, use `new Email()` instead.");
};