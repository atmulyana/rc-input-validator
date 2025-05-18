/**
 * https://github.com/atmulyana/rc-input-validator
 */
import React, { CSSProperties } from 'react';
import {emptyString, extendObject, noop, proxyObject} from 'javascript-common';
import {extRefCallback, setRef} from 'reactjs-common';
import {useState} from '../helpers';
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
    StyleProp,
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
    toString() {
        return this.#firstPath;
    }
}

type InputValue<Type> = Type extends 'number' | 'range' ? number :
                        string;
type InputPropValue<Type> = Type extends 'file' ? '' : InputValue<Type>;
type InputRefValue<Type> = Type extends 'file' ? readonly File[] : InputValue<Type>;
//@ts-ignore: we need to define the new type of `value`
export interface HtmlInputRef<Type extends string = string> extends HTMLInputElement {
    type: Type,
    value: InputRefValue<Type>,
}
type InpProps<Type extends string> = Omit<
    React.ComponentProps<'input'>,
    'defaultChecked' | 'defaultValue' | 'onChange' | 'type' | 'ref' | 'style' | 'value'
> & {
    onChange?: React.ChangeEventHandler<HtmlInputRef<Type>>,
    type?: Type,
    style?: StyleProp,
    value?: InputRefValue<Type>,
};
//@ts-ignore: consider that `HtmlInputRef<Type>` can be casted to `HTMLInputElement`  
type InpInputProps<Type extends string> = InputProps<HtmlInputRef<Type>, InpProps<Type>, InputPropValue<Type>, InputRefValue<Type>>;
type InputOuterProps<Type extends string> = Omit<InpInputProps<Type>, 'Component'>;
function inputValue<Type extends string>(input: HTMLInputElement) {
    return {
        get type() {
            return input.type as Type;
        },
        get value() {
            let val: any;
            if (['number', 'range'].includes(input.type)) {
                val = parseFloat(input.value); //if the value typed is an invalid numeric, `input.value` will be an empty string
            }
            else if (input.type == 'file') {
                val = new FileArray(input.value, input.files as FileList);
            }
            else {
                val = input.value;
            }
            return val as InputRefValue<Type>;
        },
        set value(val) {
            if (input.type == 'file') {
            }
            else if (typeof(val) == 'number') {
                input.value = isNaN(val) ? emptyString : val + emptyString;
            }
            else {
                input.value = val as string;
            }
        },
    }
}
const HtmlInput = React.forwardRef(function HtmlInput<Type extends React.HTMLInputTypeAttribute = 'text'>(
    {onChange, style, type, value, ...props}: InpProps<Type>,
    ref: React.Ref<HtmlInputRef<Type>>
) {
    const changeHandler: React.ChangeEventHandler<HTMLInputElement> = ev => {
        if (onChange) {
            const target = ev.target;
            const event = ev as React.ChangeEvent<HtmlInputRef<Type>>;
            event.target = extendObject(target, inputValue<Type>(target));
            onChange(event);
        }
    };
    const $ref = extRefCallback<HTMLInputElement, Pick<HtmlInputRef<Type>, 'type' | 'value'>>(
        //@ts-ignore: we need to define the new type of `value`
        ref, /*must not be `null`, refers to `refCallback` in `forwardRef` in "../Validation.tsx"*/
        _ref => inputValue(_ref)
    );

    return <input
        {...props}
        ref={$ref}
        onChange={changeHandler}
        style={style as CSSProperties | undefined /* has been converted by `setStyle` (`setStyleDefault`) in `withValidation` */}
        type={type}
        value={
            typeof(value) == 'string' ? value :
            typeof(value) == 'number' ? (isNaN(value) ? emptyString : value) :
            value ? (value as FileArray).firstPath :
            value
        }
    />;
});
HtmlInput.displayName = 'HtmlInput';
export const Input = React.forwardRef(function Input<Type extends React.HTMLInputTypeAttribute = 'text'>(
    props: InputOuterProps<Type>,
    ref: React.Ref<HtmlInputRef<Type> & InputRef>
) {
    const InputComponet = ValidatedInput as (
        (
            props: InpInputProps<Type> & React.RefAttributes<HtmlInputRef<Type> & InputRef>
        ) => React.ReactNode
    );
    return <InputComponet {...props} Component={HtmlInput} ref={ref} />;
}) as ({
    /**
     * Needs to cast to a Function Component so that `Type` type has the effect. If not casted then
     *      <Input type="number" value="a value" ... >
     * will be no type error even though `value` is a string. It should be a number.
     */
    <Type extends React.HTMLInputTypeAttribute = 'text'>(
        props: InputOuterProps<Type> & React.RefAttributes<HtmlInputRef<Type> & InputRef>
    ): React.ReactNode,

    displayName: 'Input',
});
Input.displayName = 'Input';


type SelectValue<Multiple> = Multiple extends true ? readonly string[] :
                             Multiple extends false ? string : string;
//@ts-ignore: we need to define the new type of `value`
export interface HtmlSelectRef<Multiple extends (boolean | undefined) = boolean> extends HTMLSelectElement {
    multiple: NonNullable<Multiple>,
    value: SelectValue<Multiple>
}
type SelectProps<Multiple extends (boolean | undefined)> = Omit<
    React.ComponentProps<'select'>,
    'defaultChecked' | 'defaultValue' | 'multiple' | 'onChange' | 'ref' | 'style' | 'value'
> & {
    multiple?: Multiple,
    onChange?: React.ChangeEventHandler<HtmlSelectRef<Multiple>>,
    style?: StyleProp,
    value?: SelectValue<Multiple>,
};
type SelectInputProps<Multiple extends (boolean | undefined)> =
    //@ts-ignore: consider that `HtmlSelectRef<Multiple>` can be casted to `HTMLSelectElement`
    InputProps<HtmlSelectRef<Multiple>, SelectProps<Multiple>, SelectValue<Multiple>>;
type SelectOuterProps<Multiple extends (boolean | undefined)> = Omit<SelectInputProps<Multiple>, 'Component'>;
function selectValue<Multiple>(input: HTMLSelectElement) {
    return {
        get multiple() {
            return input.multiple as NonNullable<Multiple>;
        },
        get value() {
            let val: any;
            if (input.multiple) {
                val = [...input.selectedOptions].map(opt => opt.value);
            }
            else {
                val = input.value;
            }
            return val as SelectValue<Multiple>;
        },
        set value(val) {
            const vals = Array.isArray(val) ? (val as string[]) : [val as string];
            const values = new Set(vals)
            for (let i = 0; i < input.options.length; i++) {
                const item = input.options.item(i);
                if (!item) continue;
                item.selected = values.has(item.value);
                if (item.selected && !input.multiple) break; //if not multiple then only one selected
            }
        },
    }
}
const HtmlSelect = React.forwardRef(function HtmlSelect<Multiple extends (boolean | undefined)>(
    {children, multiple, onChange, style, value, ...props}: SelectProps<Multiple>,
    ref: React.Ref<HtmlSelectRef<Multiple>>
) {
    const changeHandler: React.ChangeEventHandler<HTMLSelectElement> = ev => {
        if (onChange) {
            const target = ev.target;
            const event = ev as React.ChangeEvent<HtmlSelectRef<Multiple>>;
            event.target = extendObject(target, selectValue<Multiple>(target));
            onChange(event);
        }
    };
    const $ref = extRefCallback<HTMLSelectElement, Pick<HtmlSelectRef<Multiple>, 'multiple' | 'value'>>(
        //@ts-ignore: about `value` type ==> we need to define the new type of `value`
        ref, /*must not be `null`, refers to `refCallback` in `forwardRef` in "../Validation.tsx"*/
        _ref => selectValue<Multiple>(_ref)
    );
    return <select
        {...props}
        ref={$ref}
        multiple={multiple}
        onChange={changeHandler}
        style={style as CSSProperties | undefined /* has been converted by `setStyle` (`setStyleDefault`) in `withValidation` */}
        value={
            multiple ? (
                Array.isArray(value) ? value :
                value                ? [value] :
                                       (value ?? []) || [emptyString] 
            ) :
            value
        }
    >
        {children}
    </select>;
});
HtmlSelect.displayName = 'HtmlSelect';
export const Select = React.forwardRef(function Select<Multiple extends (boolean | undefined) = false>(
    props: SelectOuterProps<Multiple>,
    ref: React.Ref<HtmlSelectRef<Multiple> & InputRef>
) {
    const InputComponet = ValidatedInput as (
        (
            props: SelectInputProps<Multiple> & React.RefAttributes<HtmlSelectRef<Multiple> & InputRef>
        ) => React.ReactNode
    );
    return <InputComponet {...props} Component={HtmlSelect} ref={ref} />;
}) as ({
    /**
     * Needs to cast to a Function Component so that `Multiple` type has the effect. If not casted then
     *      <Select multiple value="a value" ... >
     * will be no type error even though `value` is a string. It should be an array of string.
     */
    <Multiple extends (boolean | undefined) = false>(
        props: SelectOuterProps<Multiple> & React.RefAttributes<HtmlSelectRef<Multiple> & InputRef>
    ): React.ReactNode,

    displayName: 'Select',
});
Select.displayName = "Select";


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
HtmlTextArea.displayName = 'HtmlTextArea';
export const TextArea = React.forwardRef(function TextArea(
    props: TextAreaForwardProps,
    ref: React.Ref<HTMLTextAreaElement & InputRef>
) {
    return <ValidatedInput {...props} Component={HtmlTextArea} ref={ref} />;
});
TextArea.displayName = 'TextArea';


type CheckBoxesValue = string | readonly string[];
interface CheckBoxesInstance extends HTMLDivElement {
    focus: () => void,
    value: readonly string[]
}
type CheckBoxesProps = ElementProps<CheckBoxesInstance, readonly string[]>
    & InputBaseProps<CheckBoxesInstance, readonly string[]>
    & {
        horizontal?: boolean,
        options: InputOptions,
    };
type CheckBoxesOuterProps = Omit<InputProps<CheckBoxesInstance, CheckBoxesProps, CheckBoxesValue, readonly string[]>, 'Component'>;
const HtmlCheckBoxes = React.forwardRef(function HtmlCheckBoxes(
    {className, horizontal, name, onChange, options, style, value = [], ...props}: CheckBoxesProps,
    ref: React.Ref<CheckBoxesInstance>
) {
    const id = React.useId();
    const state = useState(() => {
        const state = {
            ref: null as (CheckBoxesInstance | null),
            refCallback: extRefCallback<HTMLDivElement, Pick<CheckBoxesInstance, 'focus' | 'value'>>(
                ref, /*must not be `null`, refers to `refCallback` in `forwardRef` in "../Validation.tsx"*/
                {
                    focus() {
                        state.ref?.querySelector('input')?.focus();
                    },
                    get value() {
                        const vals: string[] = [];
                        state.ref?.querySelectorAll('input:checked').forEach(
                            item => vals.push((item as HTMLInputElement).value)
                        );
                        return vals;
                    },
                },
                newRef => state.ref = newRef
            ),
        }
        return state;
    });
    
    const changeHandler: React.ChangeEventHandler<HTMLInputElement> = ev => {
        if (onChange && state.ref) {
            const event: React.ChangeEvent<CheckBoxesInstance> = extendObject(ev, {
                type: 'change',
                target: state.ref,
                currentTarget: state.ref,
            });
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
            className,
        ])}
        ref={state.refCallback}
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
                    checked={value.includes(opt.value)}
                    onChange={changeHandler}
                /><label htmlFor={key}>&nbsp;{opt.label ?? opt.value}</label>
            </span>
        ))}
    </div>;
});
HtmlCheckBoxes.displayName = 'HtmlCheckBoxes';
export const CheckBoxes = React.forwardRef(function CheckBoxes(
    {value, ...props}: CheckBoxesOuterProps,
    ref: React.Ref<CheckBoxesInstance & InputRef>
) {
    const vals: readonly string[] = Array.isArray(value) ? value :
                                    value ? [value] : [];
    return <ValidatedInput {...props} Component={HtmlCheckBoxes} ref={ref} value={vals} />;
});
CheckBoxes.displayName = 'CheckBoxes';


interface RadioButtonsInstance extends HTMLDivElement {
    focus: () => void,
    value: string,
}
type RadioButtonsProps = ElementProps<RadioButtonsInstance, string>
    & InputBaseProps<RadioButtonsInstance, string>
    & {
        horizontal?: boolean,
        options: InputOptions,
    };
type RadioButtonsForwardProps = Omit<InputProps<RadioButtonsInstance, RadioButtonsProps, string>, 'Component'>;
const HtmlRadioButtons = React.forwardRef(function HtmlRadioButtons(
    {className, horizontal, name, onChange, options, style, value, ...props}: RadioButtonsProps,
    ref: React.Ref<RadioButtonsInstance>
) {
    const id = React.useId();
    name = name || id;
    const state = useState(() => {
        const state = {
            ref: null as (RadioButtonsInstance | null),
            refCallback: extRefCallback<HTMLDivElement, Pick<RadioButtonsInstance, 'focus' | 'value'>>(
                ref, /*must not be `null`, refers to `refCallback` in `forwardRef` in "../Validation.tsx"*/
                {
                    focus() {
                        state.ref?.querySelector('input')?.focus();
                    },
                    get value(): string {
                        return (state.ref?.querySelector('input:checked') as HTMLInputElement)?.value ?? emptyString;
                    },
                },
                newRef => state.ref = newRef
            ),
        }
        return state;
    });
    
    const clickHandler: React.MouseEventHandler<HTMLInputElement> = ev => {
        if (onChange && state.ref) {
            const event: React.ChangeEvent<RadioButtonsInstance> = extendObject(ev, {
                type: 'change',
                target: state.ref,
                currentTarget: state.ref,
            });
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
            className,
        ])}
        ref={state.refCallback}
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
HtmlRadioButtons.displayName = 'HtmlRadioButtons';
export const RadioButtons = React.forwardRef(function RadioButtons(
    props: RadioButtonsForwardProps,
    ref: React.Ref<RadioButtonsInstance & InputRef>
) {
    return <ValidatedInput {...props} Component={HtmlRadioButtons} ref={ref} />;
});
RadioButtons.displayName = 'RadioButtons';