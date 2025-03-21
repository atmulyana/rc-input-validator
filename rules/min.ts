/**
 * https://github.com/atmulyana/rc-input-validator
 */
import type {ComparableType, Rule} from '../types';
import messages from '../messages';
import ValidationRule from './ValidationRule';

export class Min extends ValidationRule<ComparableType> {
    constructor(min: ComparableType | (() => ComparableType)) {
        super();
        this.min = min;
        this.setPriority(2);
    }

    min: ComparableType | (() => ComparableType);

    get errorMessage() {
        return this.lang(messages.min);
    }

    validate(): Rule<ComparableType> {
        const min = typeof(this.min) == 'function' ? this.min() : this.min; 
        let valType = typeof this.value,
            limitType = typeof min;
        if (valType == 'bigint') valType = 'number';
        if (limitType == 'bigint') limitType = 'number';

        if (limitType == valType && (
            valType == 'number' || 
            valType == 'string' || 
            (this.value instanceof Date && min instanceof Date)
        ))
            this.isValid = this.value >= min;
        else
            this.isValid = false;
        return this;
    }
}
export const min = (minVal: ComparableType | (() => ComparableType)): Min => new Min(minVal);
