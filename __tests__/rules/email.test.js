/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {email, Email} from '../../rules/email';

test('validation: email', () => {
    expect(email.setValue('abc').validate().isValid).toBe(false);
    expect(email.setValue('abc@').validate().isValid).toBe(false);
    expect(email.setValue('abc@def').validate().isValid).toBe(false);
    expect(email.setValue('abc@def.com').validate().isValid).toBe(true);
});

test('validation: dissallowing setMessageFunc call on `email`', () => {
    expect(() => email.setMessageFunc(() => '')).toThrow();
    expect(() => new Email().setMessageFunc(() => '')).not.toThrow();
});

test('validation: dissallowing setPriority call on `email`', () => {
    expect(() => email.setPriority(0)).toThrow();
    expect(() => new Email().setPriority(0)).not.toThrow();
});