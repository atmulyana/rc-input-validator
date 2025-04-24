/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {date} from '../../rules/date';

test('validation: date default pattern', () => {
    let val = date().setValue('2025-04-11').validate();
    expect(val.isValid).toBe(true);
    expect(val.resultValue.getDate()).toBe(11);
    expect(val.resultValue.getMonth()).toBe(3);
    expect(val.resultValue.getFullYear()).toBe(2025);
    val = date().setValue('abc').validate();
    expect(val.isValid).toBe(false);
    expect(val.resultValue).toBe(null);
});

test('validation: date on "MMM d, yyyy" pattern', () => {
    let val = date("MMM d, yyyy").setValue('Apr 11, 2025').validate();
    expect(val.isValid).toBe(true);
    expect(val.resultValue.getDate()).toBe(11);
    expect(val.resultValue.getMonth()).toBe(3);
    expect(val.resultValue.getFullYear()).toBe(2025);
    val = date("MMM d, yyyy").setValue('2025-04-11').validate();
    expect(val.isValid).toBe(false);
    expect(val.resultValue).toBe(null);
});

test('validation: date with time', () => {
    let val = date("yyyy-MM-dd hh:mm a").setValue('2025-04-11 10:09 PM').validate();
    expect(val.isValid).toBe(true);
    expect(val.resultValue.getDate()).toBe(11);
    expect(val.resultValue.getMonth()).toBe(3);
    expect(val.resultValue.getFullYear()).toBe(2025);
    expect(val.resultValue.getHours()).toBe(22);
    expect(val.resultValue.getMinutes()).toBe(9);
    val = date("yyyy-MM-dd hh:mm a").setValue('2025-04-11').validate();
    expect(val.isValid).toBe(false);
    expect(val.resultValue).toBe(null);
});