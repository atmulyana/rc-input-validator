/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {time} from '../../rules/time';

test('validation: time default pattern', () => {
    let val = time().setValue('23:24').validate();
    expect(val.isValid).toBe(true);
    expect(val.resultValue.getUTCHours()).toBe(23);
    expect(val.resultValue.getUTCMinutes()).toBe(24);
    val = time().setValue('abc').validate();
    expect(val.isValid).toBe(false);
    expect(val.resultValue).toBe(null);
});

test('validation: date on "hh:mm:ss" pattern', () => {
    let val = time("hh:mm:ss").setValue('23:24:25').validate();
    expect(val.isValid).toBe(true);
    expect(val.resultValue.getUTCHours()).toBe(23);
    expect(val.resultValue.getUTCMinutes()).toBe(24);
    expect(val.resultValue.getUTCSeconds()).toBe(25);
    val = time("hh:mm:ss").setValue('23:24').validate();
    expect(val.isValid).toBe(false);
    expect(val.resultValue).toBe(null);
});