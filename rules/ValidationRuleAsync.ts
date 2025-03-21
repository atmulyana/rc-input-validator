/**
 * https://github.com/atmulyana/rc-input-validator
 */
import Rule from './Rule';

export default class<T, R = any> extends Rule<T, R> {
    async validate(): Promise<Rule<T>> {
        return this;
    }
}