/**
 * https://github.com/atmulyana/rc-input-validator
 */
import type {Rule} from '../../types';
import messages from '../messages';
import ValidationRule from '../../rules/ValidationRule';

export type TUnit = 'K' | 'M' | 'G' | 'k' | 'm' | 'g';
export type TSize = number | {size: number, unit?: TUnit};

const multipliers: {[unit: string]: number} = {
    K: 1024,
    M: 1024 * 1024,
    G: 1024 * 1024 * 1024,
};

function calculateSize(size: TSize) {
    if (typeof(size) == 'number') return size;
    const multiplier = multipliers[(size.unit ?? '').toUpperCase()] || 1;
    return size.size * multiplier;
}

type TCalculateSize = typeof calculateSize;
type TValidateFunc = (this: FileCheck, files: File[], calculateSize: TCalculateSize) => boolean;

export default class FileCheck extends ValidationRule<File | readonly File[]> {
    #message: string = messages.fileCheck;
    #validateFunc!: TValidateFunc;

    constructor(validateFunc: TValidateFunc, message: string) {
        super();
        this.#validateFunc = validateFunc.bind(this);
        this.#message = message;
    }

    get errorMessage() {
        return this.lang(this.#message);
    }
    
    validate(): Rule<File | readonly File[]> {
        const files = Array.isArray(this.value) ? this.value : [this.value];
        this.isValid = this.#validateFunc(files, calculateSize);
        return this;
    }
}