/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {emptyString} from 'javascript-common';
import type {Rule, ValidateFunction} from '../types';
import messages from '../messages';
import ValidationRule from './ValidationRule';

export class CustomRule extends ValidationRule<unknown> {
    constructor(validateFunc: ValidateFunction<unknown>, errorMessage?: string) {
        super();
        this.#validate = validateFunc;
        this.#errorMessage = typeof(errorMessage) == 'string' ? errorMessage : null;
        this.setPriority(1000);
    }

    #validate: ValidateFunction<unknown>;
    #errorMessage: Nullable<string>;
    #message: Nullable<string>;

    get errorMessage() {
        return this.#message;
    }

    validate(): Rule<unknown> {
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
export const rule = (validateFunc: ValidateFunction<unknown>, errorMessage?: string): Rule<unknown> => new CustomRule(validateFunc, errorMessage);
