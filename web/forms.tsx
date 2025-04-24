/**
 * https://github.com/atmulyana/rc-input-validator
 */
import React from 'react';
import {emptyString, extendObject, noop, proxyObject} from 'javascript-common';
import {extRefCallback, setRef} from 'reactjs-common';
import type {ContextRef, InputRef} from "../types";
import {
    defaultStyle,
    getStyleProps,
} from './helpers';
import type {
    ElementProps,
    InputBaseProps,
    InputOptions,
    InputProps,
} from './types';
import {ValidationContext} from './Context';
import {ValidatedInput} from './Validation';


export const Form = React.forwardRef(function Form(
    {
        children,
        contextProps = {},
        onSubmit,
        ...props

    }: Omit<React.ComponentProps<'form'>, 'noValidate'> & {
        contextProps?: Omit<React.ComponentProps<typeof ValidationContext>, 'ref' | 'key' | 'children'>
    },
    ref: React.Ref<HTMLFormElement & ContextRef>
) {
    const formRef = React.useRef<HTMLFormElement>(null);
    const ctxRef = React.useRef<ContextRef>(null);
    const submitHandler = React.useCallback((ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        ctxRef.current?.validateAsync().then(isValid => {
            if (isValid) {
                if (onSubmit) {
                    let defaultPrevented = false;
                    const event = extendObject(ev, {
                        get defaultPrevented() {
                            return defaultPrevented;
                        },
                        isDefaultPrevented() {
                            return defaultPrevented;
                        },
                        preventDefault() {
                            defaultPrevented = true;
                            ev.preventDefault();
                        },
                    });
                    onSubmit(event);
                    if (event.isDefaultPrevented()) return;
                }
                formRef.current?.submit();
            }
        });
        return false;
    }, [onSubmit]);

    React.useEffect(() => {
        setRef(ref, proxyObject(formRef.current, ctxRef.current));
    }, []);
    
    return <ValidationContext {...contextProps} ref={ctxRef}>
        <form {...props} ref={formRef} onSubmit={submitHandler} noValidate>
            {children}
        </form>
    </ValidationContext>;
});

class FileArray extends Array<File> {
    #firstPath = '';
    get firstPath() { return this.#firstPath; }
    constructor(firstPath: string, files: FileList) {
        super(...Array.from(files));
        this.#firstPath = firstPath;
    }
}

type InputValue<Type> = Type extends 'number' | 'range' ? number :
                        Type extends 'file' ? readonly File[] :
                        string;
type InpProps<Type> = Omit<
    React.ComponentProps<'input'>,
    'defaultChecked' | 'defaultValue' | 'type' | 'value'
> & {
    type?: Type,
    value?: InputValue<Type>,
};
type InputForwardProps<Type> = Omit<
    InputProps<HTMLInputElement, InpProps<Type>, InputValue<Type>>,
    'Component'
>;
const HtmlInput = React.forwardRef(function HtmlInput<Type extends React.HTMLInputTypeAttribute>(
    {onChange, type, value, ...props}: InpProps<Type>,
    ref: React.Ref<HTMLInputElement>
) {
    const changeHandler: NonNullable<InputBaseProps<HTMLInputElement, InputValue<Type>>['onChange']> = ev => {
        const target = ev.target;
        ev.target = extendObject(target, {
            get value() {
                if (['number', 'range'].includes(type as any)) {
                    return parseFloat(target.value); //if the value typed is an invalid numeric, `target.value` will be an empty string
                }
                else if (type == 'file') {
                    return new FileArray(target.value, target.files as FileList);
                }
                return target.value;
            }
        });
        if (onChange) onChange(ev);
    };


    return <input
        {...props}
        ref={ref}
        onChange={changeHandler}
        type={type}
        value={
            Array.isArray(value) ? (value as FileArray)?.firstPath ?? emptyString :
            typeof(value) == 'string' ? value :
            isNaN(value as any) ? emptyString : (value as number)
        }
    />;
});
export const Input = React.forwardRef(function Input<Type extends React.HTMLInputTypeAttribute>(
    props: InputForwardProps<Type>,
    ref: React.Ref<HTMLInputElement & InputRef>
) {
    const InputComponent = ValidatedInput as React.AbstractComponent<
        InputProps<HTMLInputElement, InpProps<Type>, InputValue<Type>>,
        HTMLInputElement & InputRef
    >;
    return <InputComponent {...props} Component={HtmlInput} ref={ref} />;
});

type SelectValue<Multiple> = Multiple extends true ? readonly string[] : string;
type SelectProps<Multiple> = Omit<
    React.ComponentProps<'select'>,
    'defaultChecked' | 'defaultValue' | 'multiple' | 'value'
> & {
    multiple?: Multiple,
    value?: SelectValue<Multiple>,
};
type SelectForwardProps<Multiple> = Omit<InputProps<HTMLSelectElement, SelectProps<Multiple>, SelectValue<Multiple>>, 'Component'>;
const HtmlSelect = React.forwardRef(function HtmlSelect<Multiple extends boolean>(
    {children, multiple, onChange, value, ...props}: SelectProps<Multiple>,
    ref: React.Ref<HTMLSelectElement>
) {
    const changeHandler: NonNullable<InputBaseProps<HTMLSelectElement, SelectValue<Multiple>>['onChange']> = ev => {
        const target = ev.target;
        ev.target = extendObject(target, {
            get value() {
                if (multiple) {
                    return [...target.selectedOptions].map(opt => opt.value);
                }
                return target.value;
            }
        });
        if (onChange) onChange(ev);
    };
    return <select {...props} ref={ref} multiple={multiple} onChange={changeHandler}
        value={multiple && !Array.isArray(value) ? [value as string] : value}
    >
        {children}
    </select>;
});
export const Select = React.forwardRef(function Select<Multiple extends boolean>(
    props: SelectForwardProps<Multiple>,
    ref: React.Ref<HTMLSelectElement & InputRef>
) {
    const InputComponent = ValidatedInput as React.AbstractComponent<
        InputProps<HTMLSelectElement, SelectProps<Multiple>, SelectValue<Multiple>>,
        HTMLSelectElement & InputRef
    >;
    return <InputComponent {...props} Component={HtmlSelect} ref={ref} />;
});

type TextAreaProps = Omit<
    React.ComponentProps<'textarea'>,
    'defaultChecked' | 'defaultValue' | 'value'
> & {
    value?: string,
};
type TextAreaForwardProps = Omit<InputProps<HTMLTextAreaElement, TextAreaProps, string>, 'Component'>;
const HtmlTextArea = React.forwardRef(function HtmlTextArea(
    props: TextAreaProps,
    ref: React.Ref<HTMLTextAreaElement>
) {
    return <textarea {...props} ref={ref} />;
});
export const TextArea = React.forwardRef(function TextArea(
    props: TextAreaForwardProps,
    ref: React.Ref<HTMLTextAreaElement & InputRef>
) {
    const InputComponent = ValidatedInput as React.AbstractComponent<
        InputProps<HTMLTextAreaElement, TextAreaProps, string>,
        HTMLTextAreaElement & InputRef
    >;
    return <InputComponent {...props} Component={HtmlTextArea} ref={ref} />;
});

type CheckBoxesValue = string | readonly string[];
interface CheckBoxesInstance extends HTMLElement {
    focus: () => void,
    value?: CheckBoxesValue
}
type CheckBoxesProps = ElementProps
    & InputBaseProps<CheckBoxesInstance, CheckBoxesValue>
    & {
        horizontal?: boolean,
        options: InputOptions,
    };
type CheckBoxesForwardProps = Omit<InputProps<CheckBoxesInstance, CheckBoxesProps, CheckBoxesValue>, 'Component'>;
const HtmlCheckBoxes = React.forwardRef(function HtmlCheckBoxes(
    {horizontal, name, onChange, options, style, value, ...props}: CheckBoxesProps,
    ref: React.Ref<CheckBoxesInstance>
) {
    const vals = Array.isArray(value) ? value :
                 value ? [value] : [];
    const id = React.useId();
    let containerObj!: CheckBoxesInstance;
    const _ref = extRefCallback<HTMLElement, {focus: () => void, value?: CheckBoxesValue}>(
        ref, /*must not be `null`, refers to `refCallback` in `forwardRef` in "../Validation.tsx"*/
        {
            focus() {
                containerObj?.querySelector('input')?.focus();
            },
            value,
        },
        newRef => containerObj = newRef
    );
    
    const changeHandler: React.ChangeEventHandler<HTMLInputElement> = ev => {
        if (onChange) {
            let newValue: string[];
            if (ev.target.checked) {
                newValue = [...vals, ev.target.value];
            }
            else {
                newValue = vals.filter(item => item != ev.target.value);
            }

            const event: React.ChangeEvent<CheckBoxesInstance> = {
                ...ev,
                target: { 
                    ...containerObj,
                    value: newValue,
                }
            };
            onChange(event);
        }
    };
    
    let opt: Exclude<InputOptions[0], string>, key: string;
    return <div
        {...props}
        {...getStyleProps([
            defaultStyle.checkedInputs,
            horizontal ? {flexDirection: 'row'} : null,
            style,
        ])}
        ref={_ref}
    >
        {options.map((option, idx) => (
            opt = typeof(option) == 'string' ? {value: option} : option,
            key = `${id}_${idx}`,
            <span key={key} style={{alignItems: 'center', display:'flex', flex:'none'}}>
                <input
                    id={key}
                    name={name}
                    type='checkbox'
                    value={opt.value}
                    checked={vals.includes(opt.value)}
                    onChange={changeHandler}
                /><label htmlFor={key}>&nbsp;{opt.label ?? opt.value}</label>
            </span>
        ))}
    </div>;
});
export const CheckBoxes = React.forwardRef(function CheckBoxes(
    props: CheckBoxesForwardProps,
    ref: React.Ref<CheckBoxesInstance & InputRef>
) {
    //@ts-expect-error
    return <ValidatedInput {...props} Component={HtmlCheckBoxes} ref={ref} />;
});

interface RadioButtonsInstance extends HTMLElement {
    focus: () => void,
    value?: string,
}
type RadioButtonsProps = ElementProps
    & InputBaseProps<RadioButtonsInstance, string>
    & {
        horizontal?: boolean,
        options: InputOptions,
    };
type RadioButtonsForwardProps = Omit<InputProps<RadioButtonsInstance, RadioButtonsProps, string>, 'Component'>;
const HtmlRadioButtons = React.forwardRef(function HtmlRadioButtons(
    {horizontal, name, onChange, options, style, value, ...props}: RadioButtonsProps,
    ref: React.Ref<RadioButtonsInstance>
) {
    const id = React.useId();
    name = name || id;
    let containerObj!: RadioButtonsInstance;
    const _ref = extRefCallback<HTMLElement, {focus: () => void, value?: string}>(
        ref, /*must not be `null`, refers to `refCallback` in `forwardRef` in "../Validation.tsx"*/
        {
            focus() {
                containerObj?.querySelector('input')?.focus();
            },
            value,
        },
        newRef => containerObj = newRef
    );
    
    const clickHandler: React.MouseEventHandler<HTMLInputElement> = ev => {
        if (onChange) {
            const event: React.ChangeEvent<RadioButtonsInstance> = {
                ...ev,
                target: { 
                    ...containerObj,
                    value: ev.currentTarget.value,
                }
            };
            onChange(event);
        }
    };
    
    let opt: Exclude<InputOptions[0], string>, key: string;
    return <div
        {...props}
        {...getStyleProps([
            defaultStyle.checkedInputs,
            horizontal ? {flexDirection: 'row'} : null,
            style,
        ])}
        ref={_ref}
        role='radiogroup'
    >
        {options.map((option, idx) => (
            opt = typeof(option) == 'string' ? {value: option} : option,
            key = `${id}_${idx}`,
            <span key={key} style={{alignItems: 'center', display:'flex', flex:'none'}}>
                <input
                    id={key}
                    name={name}
                    type='radio'
                    value={opt.value}
                    checked={value == opt.value}
                    onClick={clickHandler}
                    onChange={noop}
                /><label htmlFor={key}>&nbsp;{opt.label ?? opt.value}</label>
            </span>
        ))}
    </div>;
});
export const RadioButtons = React.forwardRef(function RadioButtons(
    props: RadioButtonsForwardProps,
    ref: React.Ref<RadioButtonsInstance & InputRef>
) {
    //@ts-expect-error
    return <ValidatedInput {...props} Component={HtmlRadioButtons} ref={ref} />;
});