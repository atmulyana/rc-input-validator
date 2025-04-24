/**
 * https://github.com/atmulyana/rc-input-validator
 */
import JsSimpleDateFormat, {NetDateTimeFormat} from 'jssimpledateformat';
import type {Rule} from '../types';
import messages from '../messages';
import ValidationRule from './ValidationRule';

const defaultPattern = "yyyy-MM-dd";
export class StrDate extends ValidationRule<string, Date> {
    static get defaultPattern() {
        return defaultPattern;
    } 
    
    #dtFormat!: JsSimpleDateFormat;
    #date!: Date;

    constructor(pattern?: string, locale?: string, isNet: boolean = false) {
        super();
        if (isNet) this.#dtFormat = new NetDateTimeFormat(pattern ?? defaultPattern, locale);
        else this.#dtFormat = new JsSimpleDateFormat(pattern ?? defaultPattern, locale);
    }

    get errorMessage() {
        return this.lang(messages.date);
    }
    
    get resultValue() {
        return this.#date;
    }

    get valueAsDate() {
        return this.#dtFormat.parse(this.value);
    }
    
    parse(strDate: string) {
        return this.#dtFormat.parse(strDate);
    }

    validate(): Rule<string, Date> {
        const date = this.#dtFormat.parse(this.value);
        this.#date = date as Date;
        this.isValid = !!date;
        return this;
    }
}

export const date = (pattern?: string, locale?: string, isNet?: boolean) => new StrDate(pattern, locale, isNet);