/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {emptyString} from 'javascript-common';
import type {Rule, ValidateFunctionAsync} from '../types';
import messages from '../messages';
import ValidationRuleAsync from './ValidationRuleAsync';

export class CustomRuleAsync<V = unknown> extends ValidationRuleAsync<V> {
    constructor(validateFunc: ValidateFunctionAsync<V>, errorMessage?: string) {
        super();
        this.#validate = validateFunc;
        this.#errorMessage = typeof(errorMessage) == 'string' ? errorMessage : null;
        this.setPriority(1001);
    }

    #validate: ValidateFunctionAsync<V>;
    #errorMessage: Nullable<string>;
    #message: Nullable<string>;

    get errorMessage() {
        return this.#message;
    }

    async validate(): Promise<Rule<V>> {
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
export const ruleAsync = <V = unknown>(validateFunc: ValidateFunctionAsync<V>, errorMessage?: string): Rule<V> =>
    new CustomRuleAsync(validateFunc, errorMessage);