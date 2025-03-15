/**
 * https://github.com/atmulyana/rc-input-validator
 *
 * @format
 * @flow strict-local
 */
import Rule from './Rule';

export default class<T> extends Rule<T> {
    validate(): Rule<T> {
        return this;
    }
}