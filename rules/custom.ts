/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {emptyString} from 'javascript-common';
import type {Rule, ValidateFunction} from '../types';
import messages from '../messages';
import ValidationRule from './ValidationRule';

export class CustomRule<V = unknown> extends ValidationRule<V> {
    constructor(validateFunc: ValidateFunction<V>, errorMessage?: string) {
        super();
        this.#validate = validateFunc;
        this.#errorMessage = typeof(errorMessage) == 'string' ? errorMessage : null;
        this.setPriority(1000);
    }

    #validate: ValidateFunction<V>;
    #errorMessage: Nullable<string>;
    #message: Nullable<string>;

    get errorMessage() {
        return this.#message;
    }

    validate(): Rule<V> {
        const validationValue = this.#validate(this.value); //It may return true if valid or an error message
        this.isValid = validationValue === true;
        
        if (this.isValid) {
            this.#message = null;
        }
        else {
            const msg = (typeof(validationValue) == 'string') ? validationValue.trim() :
                        this.#errorMessage                    ? this.#errorMessage.trim() :
                                                                emptyString;
            this.#message = msg || this.lang(messages.invalid);
        }
        
        return this;
    }
}
export const rule = <V = unknown>(validateFunc: ValidateFunction<V>, errorMessage?: string): Rule<V> =>
    new CustomRule(validateFunc, errorMessage);
