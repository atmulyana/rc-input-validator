/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {emptyString} from 'javascript-common';
import type {Rule, ValidateFunctionAsync} from '../types';
import messages from '../messages';
import ValidationRuleAsync from './ValidationRuleAsync';

export class CustomRuleAsync extends ValidationRuleAsync<unknown> {
    constructor(validateFunc: ValidateFunctionAsync<unknown>, errorMessage?: string) {
        super();
        this.#validate = validateFunc;
        this.#errorMessage = typeof(errorMessage) == 'string' ? errorMessage : null;
        this.setPriority(1001);
    }

    #validate: ValidateFunctionAsync<unknown>;
    #errorMessage: Nullable<string>;
    #message: Nullable<string>;

    get errorMessage() {
        return this.#message;
    }

    async validate(): Promise<Rule<unknown>> {
        const validationValue = await new Promise(resolve => {
            this.#validate(this.value, resolve);
        });
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
export const ruleAsync = (validateFunc: ValidateFunctionAsync<unknown>, errorMessage?: string): CustomRuleAsync => new CustomRuleAsync(validateFunc, errorMessage);