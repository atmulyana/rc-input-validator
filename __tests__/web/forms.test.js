/**
 * https://github.com/atmulyana/rc-input-validator
 * 
 * @jest-environment jsdom
 */
import {act, cleanup, render, screen} from '@testing-library/react-native'; //cannot use "@testing-library/react", needs `ReactTestInstance` 
import {Form as Form1, Input} from "../../web/forms";
import {defaultStyle} from '../../web/helpers';
import {required} from '../../rules';

function mock_setRef(refProp, ref) {
    if (typeof(refProp) == 'function') refProp(ref);
    else if (refProp && typeof(refProp) == 'object') refProp.current = ref;
}

let mock_inputValue = '';
jest.mock('reactjs-common', 
    () => ({
        __esModule: true,
        setRef: mock_setRef,
        extRefCallback(refProp, extRef, callback) {
            return ref => {
                if (typeof(extRef) == 'function') {
                    extRef = extRef(ref);
                }
                let newRef = extRef;
                if ('getInput' in extRef) { //Form
                    newRef = {
                        ...extRef,
                        submit() {
                        },
                    };
                }
                else {
                    newRef = {
                        //...extRef,  //Cannot be like this, `extRef` is a proxy object
                        value: mock_inputValue,
                    };
                    Object.setPrototypeOf(newRef, extRef);
                }
                mock_setRef(refProp, newRef);
                if (typeof(callback) == 'function') callback(newRef);
            }
        },
    })
);


let formRef, inputRef;
const Form = ({inputStyle, inputValue, onSubmit}) => (
    mock_inputValue = inputValue,
    <Form1 ref={ref => formRef = ref} onSubmit={onSubmit}>
        <Input ref={ref => inputRef = ref}
            name="input1"
            rules={[required]}
            style={inputStyle}
            value={inputValue}
        />
    </Form1>
);

const inputStyle = {
    borderColor: 'gray',
    borderWidth: 1,
    height: 20,
    width: 100
};

afterEach(cleanup);

test('render Form and Input: check all stuff (initially)', () => {
    render(<Form />);
    
    //expect(screen.toJSON()).toMatchSnapshot();

    const form = screen.root;
    const input = form.findByType('input');
    
    expect(inputRef).not.toBeFalsy();
    expect(typeof inputRef.clearValidation).toBe('function');
    expect(typeof inputRef.getErrorMessage).toBe('function');
    expect(typeof inputRef.setErrorMessage).toBe('function');
    expect(typeof inputRef.validate).toBe('function');
    expect(typeof inputRef.validateAsync).toBe('function');
    expect(inputRef.name).toBe('input1');
    expect(inputRef.isValid).toBe(true);

    expect(formRef).not.toBeFalsy();
    expect(typeof formRef.clearValidation).toBe('function');
    expect(typeof formRef.getErrorMessage).toBe('function');
    expect(typeof formRef.setErrorMessage).toBe('function');
    expect(typeof formRef.refreshMessage).toBe('function');
    expect(typeof formRef.validate).toBe('function');
    expect(typeof formRef.validateAsync).toBe('function');
    expect(formRef.getInput('input1')).toBe(inputRef);
    expect(formRef.isValid).toBe(true);
});

test('Input styling', () => {
    const {rerender} = render(<Form />);

    const form = screen.root;
    const input = form.findByType('input');
    const inputContainer = form.findByProps({role: 'validated-input-container'});

    expect(input.props.className).toBeUndefined();
    expect(input.props.style).toBeUndefined();
    expect(inputContainer.props.className).toBeUndefined();
    expect(inputContainer.props.style).toEqual(defaultStyle.container);

    rerender(<Form inputStyle={inputStyle} />);
    expect(input.props.className).toBeUndefined();
    expect(input.props.style).toEqual(inputStyle);
    expect(inputContainer.props.className).toBeUndefined();
    expect(inputContainer.props.style).toEqual(defaultStyle.container);

    rerender(<Form inputStyle={'form-input'} />);
    expect(input.props.className).toBe('form-input');
    expect(input.props.style).toBeUndefined();
    expect(inputContainer.props.className).toBeUndefined();
    expect(inputContainer.props.style).toEqual(defaultStyle.container);

    rerender(<Form inputStyle={{$class: 'form-input', $style: inputStyle}} />);
    expect(input.props.className).toBe('form-input');
    expect(input.props.style).toEqual(inputStyle);
    expect(inputContainer.props.className).toBeUndefined();
    expect(inputContainer.props.style).toEqual(defaultStyle.container);

    rerender(<Form inputStyle={{$cover: 'container', $input: inputStyle}} />);
    expect(input.props.className).toBeUndefined();
    expect(input.props.style).toEqual(inputStyle);
    expect(inputContainer.props.className).toBe('container');
    expect(inputContainer.props.style).toEqual(defaultStyle.container);
});

test('call validation on Input', () => {
    render(<Form inputStyle={inputStyle} />);

    const form = screen.root;
    const input = form.findByType('input');
    const inputContainer = form.findByProps({role: 'validated-input-container'});

    act(() => {
        inputRef.validate();
    });
    expect(inputRef.isValid).toBe(false);
    expect(inputRef.getErrorMessage()).toBe('required');
    expect(inputContainer.children[1]?.type.name).toBe('ErrorText');
    expect(inputContainer.children[1]?.props.children).toBe('required');
    expect(input.props.style).toEqual({...inputStyle, ...defaultStyle.inputError});

    act(() => {
        inputRef.clearValidation();
    });
    expect(inputRef.isValid).toBe(true);
    expect(inputRef.getErrorMessage()).toBe('');
    expect(inputContainer.children[1]).toBeUndefined();
    expect(input.props.style).toEqual(inputStyle);
});

test('call validation on Form', async () => {
    const onSubmit = jest.fn();
    const event = new Event('submit');

    const {rerender} = render(<Form onSubmit={onSubmit} />);
    const form = screen.root.findByType('form');

    await act(async () => {
        form.props.onSubmit(event);
    });
    expect(formRef.isValid).toBe(false);
    expect(onSubmit.mock.calls.length).toBe(0);

    act(() => {
        formRef.clearValidation();
    });
    expect(formRef.isValid).toBe(true);

    rerender(<Form inputValue='value' onSubmit={onSubmit} />);

    await act(async () => {
        form.props.onSubmit(event);
    });
    expect(formRef.isValid).toBe(true);
    expect(onSubmit.mock.calls.length).toBe(1);

    act(() => {
        formRef.clearValidation();
    });
    expect(formRef.isValid).toBe(true);
});