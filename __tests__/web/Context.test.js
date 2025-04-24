/**
 * https://github.com/atmulyana/rc-input-validator
 * 
 * @jest-environment jsdom
 */
import {act, cleanup, render} from '@testing-library/react';
//import '@testing-library/jest-dom'
import {ValidationContext, Input} from '../../web';
import {required} from '../../rules';

let contextRef, inputRef1, inputRef2;
const Form = () =>
    <ValidationContext ref={ref => contextRef = ref}>
        <Input ref={ref => inputRef1 = ref} rules={required} />
        <Input ref={ref => inputRef2 = ref} rules={required} name='input2' />
    </ValidationContext>;

afterEach(cleanup);

test('ValidationContext', () => {
    act(() => {
        render(<Form />);
    });
    
    expect(contextRef).not.toBeFalsy();
    expect(typeof contextRef.clearValidation).toBe('function');
    expect(typeof contextRef.refreshMessage).toBe('function');
    expect(typeof contextRef.setErrorMessage).toBe('function');
    expect(typeof contextRef.validate).toBe('function');
    expect(typeof contextRef.validateAsync).toBe('function');
    expect(contextRef.isValid).toBe(true);
    
    expect(inputRef1).not.toBeFalsy();
    expect(typeof inputRef1.clearValidation).toBe('function');
    expect(typeof inputRef1.getErrorMessage).toBe('function');
    expect(typeof inputRef1.setErrorMessage).toBe('function');
    expect(typeof inputRef1.validate).toBe('function');
    expect(typeof inputRef1.validateAsync).toBe('function');
    expect(inputRef1.name).toBeUndefined();
    expect(inputRef1.isValid).toBe(true);

    expect(inputRef2).not.toBeFalsy();
    expect(typeof inputRef2.clearValidation).toBe('function');
    expect(typeof inputRef2.getErrorMessage).toBe('function');
    expect(typeof inputRef2.setErrorMessage).toBe('function');
    expect(typeof inputRef2.validate).toBe('function');
    expect(typeof inputRef2.validateAsync).toBe('function');
    expect(inputRef2.name).toBe('input2');
    expect(inputRef2.isValid).toBe(true);

    expect(contextRef.getErrorMessage('input2')).toBe('');
    expect(contextRef.getErrorMessage('noInput')).toBeUndefined();
    expect(Object.is(contextRef.getInput('input2'), inputRef2)).toBe(true);
    expect(contextRef.getInput('noInput')).toBeUndefined();

    act(() => {
        expect(contextRef.validate()).toBe(false);
    });
    expect(contextRef.isValid).toBe(false);
    expect(inputRef1.isValid).toBe(false);
    expect(inputRef2.isValid).toBe(false);

    expect(contextRef.getErrorMessage('input2')).toBe('required');
    expect(contextRef.getErrorMessage('noInput')).toBeUndefined();

    act(() => {
        contextRef.clearValidation();
    });
    expect(contextRef.isValid).toBe(true);
    expect(inputRef1.isValid).toBe(true);
    expect(inputRef2.isValid).toBe(true);

    expect(contextRef.getErrorMessage('input2')).toBe('');
    expect(contextRef.getErrorMessage('noInput')).toBeUndefined();
});

test('ValidationContext: get/setErrorMessage', () => {
    act(() => {
        render(<Form />);
    });
    
    expect(contextRef.isValid).toBe(true);
    expect(contextRef.getErrorMessage('input2')).toBe('');
    expect(contextRef.getErrorMessage('noInput')).toBeUndefined();
    expect(inputRef1.isValid).toBe(true);
    expect(inputRef2.isValid).toBe(true);
    expect(inputRef1.getErrorMessage()).toBe('');
    expect(inputRef2.getErrorMessage()).toBe('');

    act(() => {
        contextRef.setErrorMessage('input2', 'an error');
    });
    expect(contextRef.isValid).toBe(false);
    expect(contextRef.getErrorMessage('input2')).toBe('an error');
    expect(contextRef.getErrorMessage('noInput')).toBeUndefined();
    expect(inputRef1.isValid).toBe(true);
    expect(inputRef2.isValid).toBe(false);
    expect(inputRef1.getErrorMessage()).toBe('');
    expect(inputRef2.getErrorMessage()).toBe('an error');
});