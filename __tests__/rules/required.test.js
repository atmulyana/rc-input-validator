/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {required, Required} from '../../rules/required';

test('validation: required', () => {
    expect(required.setValue(undefined).validate().isValid).toBe(false);
    expect(required.setValue(null).validate().isValid).toBe(false);
    expect(required.setValue('').validate().isValid).toBe(false);
    expect(required.setValue('  ').validate().isValid).toBe(false);
    expect(required.setValue('  ').validate().resultValue).toBe('');
    expect(required.setValue(0).validate().isValid).toBe(true);
    expect(required.setValue(false).validate().isValid).toBe(true);
    expect(required.setValue('value').validate().isValid).toBe(true);
    expect(required.setValue('  value  ').validate().resultValue).toBe('value');
    expect(required.setValue(new Date()).validate().isValid).toBe(true);
    expect(required.setValue([]).validate().isValid).toBe(false);
    expect(required.setValue([1]).validate().isValid).toBe(true);
});

test('validation: Required.If', () => {
    expect(Required.If(() => true).setValue(undefined).validate().isValid).toBe(false);
    expect(Required.If(() => false).setValue(undefined).validate().isValid).toBe(true);
    expect(Required.If(() => true).setValue('value').validate().isValid).toBe(true);
    expect(Required.If(() => false).setValue('value').validate().isValid).toBe(true);
});



test('validation: Required.notTrimmed', () => {
    var req1 = new Required().notTrimmed().setValue(' value  ').validate(),
        req2 = new Required().notTrimmed().setValue('value').validate(),
        req3 = new Required().notTrimmed().setValue('').validate(),
        req4 = new Required().notTrimmed().setValue('  ').validate(),
        req5 = new Required().notTrimmed().setValue(null).validate(),
        req6 = new Required().notTrimmed().setValue(0).validate();
    expect(req1.isValid).toBe(true);
    expect(req1.resultValue).toBe(' value  ');
    expect(req2.isValid).toBe(true);
    expect(req2.resultValue).toBe('value');
    expect(req3.isValid).toBe(false);
    expect(req3.resultValue).toBe('');
    expect(req4.isValid).toBe(false);
    expect(req4.resultValue).toBe('  ');
    expect(req5.isValid).toBe(false);
    expect(req5.resultValue).toBe(null);
    expect(req6.isValid).toBe(true);
    expect(req6.resultValue).toBe(0);
});

test('validation: dissallowing setMessageFunc call on `required`', () => {
    expect(() => required.setMessageFunc(() => '')).toThrow();
    expect(() => new Required().setMessageFunc(() => '')).not.toThrow();
});

test('validation: dissallowing notTrimmed call on `required`', () => {
    expect(() => required.notTrimmed()).toThrow();
    expect(() => new Required().notTrimmed()).not.toThrow();
});