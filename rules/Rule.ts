/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {emptyString, noChange} from "javascript-common";
import type {LangFunction, MessageFunction} from '../types';
import {str, type FreeObject} from '../helpers/common';
import messages from '../messages';

export default /*absract*/ class Rule<V = unknown, R = any> implements FreeObject {
    static defaultLang: LangFunction = noChange;
    
    constructor() {
        let isCallingMessageFunc: boolean = false;
        let _this = this;
        /* We need the prototype's `errorMessage` getter function to get the prototype's `errorMessage` value
          because `Object.getPrototypeOf(this).errorMessage` will fail to access the fields of `this`. The getter
          function, as a function in general, can be bound to `this` as the context object. */
        let getErrorMessage: (() => Nullable<string>) | undefined;
        while(!getErrorMessage && (_this instanceof Rule)) {
            _this = Object.getPrototypeOf(_this);
            getErrorMessage = Object.getOwnPropertyDescriptor(_this, 'errorMessage')?.get?.bind(this);
        }
        _this = this;

        Object.defineProperty(this, 'errorMessage', {
            get(): Nullable<string> {
                if (isCallingMessageFunc) return getErrorMessage ? getErrorMessage() : emptyString;
                let message: Nullable<string>;
                if (_this.#messageFunc) {
                    isCallingMessageFunc = true; //to avoid recursive-calling forever
                    message = _this.#messageFunc(_this);
                    isCallingMessageFunc = false;
                }
                if (!message) message = getErrorMessage && getErrorMessage();
                return str(message, _this);
            }
        })
    }
    readonly [key: string]: unknown;
    
    #priority: number = 0;
    #messageFunc: MessageFunction<V, R>;
    #value!: V;
    
    lang: LangFunction = Rule.defaultLang;
    name: Nullable<string>;
    isValid: boolean = false;

    get priority(): number {return this.#priority}
    get errorMessage(): Nullable<string> {
        return this.lang(messages.invalid);
    }
    get messageFunc(): MessageFunction<V, R> {
        return this.#messageFunc;
    }
    get value(): V {
        return this.#value;
    }
    get resultValue(): R {
        return (this.#value as any);
    }

    setMessageFunc(func: MessageFunction<V, R>): Rule<V, R> {
        if (typeof func == 'function') //runtime check
            this.#messageFunc = func;
        else
            this.#messageFunc = null;
        return this;
    }

    setName(name: string): Rule<V, R> {
        this.name = name;
        return this;
    }

    setValue(value: V): Rule<V, R> {
        this.#value = value;
        return this;
    }

    setPriority(priority: number): Rule<V, R> {
        this.#priority = priority < 0 ? 0 : priority;
        return this;
    }
    
    validate(): Rule<V, R> | Promise<Rule<V, R>> {
        return this;
    }
}

{
    let _lang = Rule.defaultLang;
    const translate: LangFunction = (s: string) => _lang(s) + emptyString; //make sure it always returns string (for runtime)
    Object.defineProperty(Rule.prototype, 'lang', {
        get(): LangFunction {
            return translate;
        },
        set(f: LangFunction) {
            if (typeof f == 'function') //runtime check
                _lang = f;
            else _lang = Rule.defaultLang;
        }
    });
}