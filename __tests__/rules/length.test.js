/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {length, lengthMax} from '../../rules/length';

test('validation: length with min value', () => {
    const val = length(2);
    expect(val.setValue('1').validate().isValid).toBe(false);
    expect(val.setValue('12').validate().isValid).toBe(true);
    expect(val.setValue('123').validate().isValid).toBe(true);
    expect(val.setValue(1).validate().isValid).toBe(false);
    expect(val.setValue(12).validate().isValid).toBe(true);
    expect(val.setValue(123).validate().isValid).toBe(true);
    expect(val.setValue([1]).validate().isValid).toBe(false);
    expect(val.setValue([1,2]).validate().isValid).toBe(true);
    expect(val.setValue([1,2,3]).validate().isValid).toBe(true);
});

test('validation: length with max value', () => {
    const val = lengthMax(4);
    expect(val.setValue('123').validate().isValid).toBe(true);
    expect(val.setValue('1234').validate().isValid).toBe(true);
    expect(val.setValue('12345').validate().isValid).toBe(false);
    expect(val.setValue(123).validate().isValid).toBe(true);
    expect(val.setValue(1234).validate().isValid).toBe(true);
    expect(val.setValue(12345).validate().isValid).toBe(false);
    expect(val.setValue([1,2,3]).validate().isValid).toBe(true);
    expect(val.setValue([1,2,3,4]).validate().isValid).toBe(true);
    expect(val.setValue([1,2,3,4,5]).validate().isValid).toBe(false);
});

test('validation: length with min and max value', () => {
    const val = length(2, 4);
    expect(val.setValue('1').validate().isValid).toBe(false);
    expect(val.setValue('12').validate().isValid).toBe(true);
    expect(val.setValue('123').validate().isValid).toBe(true);
    expect(val.setValue('1234').validate().isValid).toBe(true);
    expect(val.setValue('12345').validate().isValid).toBe(false);
    expect(val.setValue(1).validate().isValid).toBe(false);
    expect(val.setValue(12).validate().isValid).toBe(true);
    expect(val.setValue(123).validate().isValid).toBe(true);
    expect(val.setValue(1234).validate().isValid).toBe(true);
    expect(val.setValue(12345).validate().isValid).toBe(false);
    expect(val.setValue([1]).validate().isValid).toBe(false);
    expect(val.setValue([1,2]).validate().isValid).toBe(true);
    expect(val.setValue([1,2,3]).validate().isValid).toBe(true);
    expect(val.setValue([1,2,3,4]).validate().isValid).toBe(true);
    expect(val.setValue([1,2,3,4,5]).validate().isValid).toBe(false);
});