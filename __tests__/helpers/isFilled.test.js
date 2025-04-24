/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {isFilled} from '../../helpers';

test('validation: optional', () => {
    expect(isFilled(undefined)).toBe(false);
    expect(isFilled(null)).toBe(false);
    expect(isFilled('')).toBe(false);
    expect(isFilled('  ')).toBe(false);
    expect(isFilled(0)).toBe(true);
    expect(isFilled(false)).toBe(true);
    expect(isFilled('value')).toBe(true);
    expect(isFilled(new Date())).toBe(true);
    expect(isFilled([])).toBe(false);
    expect(isFilled([''])).toBe(false);
    expect(isFilled([null])).toBe(false);
    expect(isFilled([undefined])).toBe(false);
    expect(isFilled([0])).toBe(true);
    expect(isFilled(['', ''])).toBe(true);
});