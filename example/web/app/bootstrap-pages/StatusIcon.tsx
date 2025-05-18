/**
 * Example of how to use rc-input-validator package
 * https://github.com/atmulyana/rc-input-validator
 */
import React, { type CSSProperties } from 'react';
import {
    regex,
    required,
} from 'rc-input-validator/rules';
import type {InputRef} from 'rc-input-validator/types';
import type {ElementProps, ValidationOption} from 'rc-input-validator/web';
import {getStyleProps, Input} from 'rc-input-validator/web';

const iconStyles = {
    container: {
        borderRadius: 12,
        boxSizing: 'border-box',
        height: 24,
        padding: 2,
        position: 'absolute',
        right: 4,
        top: 'calc(1.125rem - 11px)',
        width: 24,
    } as CSSProperties,
    error: {
        backgroundColor: "red",
    } as CSSProperties,
    image: {
        height: 20,
        stroke:  "white",
        strokeWidth: 4,
        width: 20,
    } as CSSProperties,
    success: {
        backgroundColor: "green",
    } as CSSProperties,
};

function Icon({id, style, ...props}: React.ComponentProps<'svg'>) {
    return <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        style={style}
    >
        <use href={`/feather-sprite.svg#${id}`} />
    </svg>;
}

function ValidationStatus({icon, message, style}: {icon: string, message?: string, style: CSSProperties}) {
    return <>
        {/** Not like invalid status, the valid status doesn't show a message.
         *  Here is the place if you want to show a message by using `span` element */}
        {message && <span className='text-success'>{message}</span>}
        
        {/** Show a status icon. By using absolute positioning, the icon is placed at the right side of input */}
        <span style={Object.assign({}, iconStyles.container, style)}>
            <Icon style={iconStyles.image} id={icon} />
        </span>
    </>
}

const inputOptions: ValidationOption<ElementProps<HTMLInputElement>> = {
    rules: [
        regex(/^0[1-9]\d{2}-\d{4}-\d{4}$/).setMessageFunc(() => 'Bad phone number'),
        required,
    ],
    setStatusStyle: (props, style, context) => {
        if (style) { //invalid status after validate or re-render when invalid
            Object.assign(props, getStyleProps(context.normalStyle, ...style));
            /** Show a status icon. By using absolute positioning, the icon is placed at the right side of input */
            return <ValidationStatus icon='x' style={iconStyles.error} />;
        }
        else if (style === null) {  //valid status after `validate` action
            Object.assign(props, getStyleProps(context.normalStyle, 'text-success border-success'));
            context.flag = 1;
            return <ValidationStatus icon='check' message="Good phone number" style={iconStyles.success} />;
        }
        else { //clear action or re-rendering when valid
            if (style === false) { // re-render such as because of editing value
                if (context.flag === 1) { //It's set above when valid after `validate` action
                    /** Not like invalid status which is automatically cleared when starts editing, valid status needs manually clearing */
                    context.clearValidation(); //This method is just to ask to clear in the next/current editing (not really to clear) 
                    context.flag = 0;
                }
            }
            else { //after `clearValidation`
                //When re-rendering, it doesn't need to revert style because it has been done by `setStyle`
                Object.assign(props, getStyleProps(context.normalStyle));
            }
            return null;
        }
    },
};

export default function StatusIconPage() {
    const input = React.useRef<InputRef & HTMLInputElement>(null);
    const inputOnBlur = React.useCallback(() => input.current?.validate(), []);
    const {rules, ...settings} = inputOptions;

    return <div className='container mx-auto'>
        <h3 className='fs-5 fw-bold lh-sm text-center mb-2'>Validation Status Icon</h3>
        <div className='mb-3'>We'll see more fancy validation status which uses an icon. The input is validated
        when it's lost of focus. Try to enter a valid and invalid phone number to the input (valid pattern:&nbsp;
        <strong className='text-nowrap'>0[1-9]dd-dddd-dddd</strong>)
        </div>

        <div className='row mb-3'>
            <label className='col-2 col-form-label'>Phone Number</label>
            <div className='col-3'>
                <Input ref={input} autoComplete='off' onBlur={inputOnBlur} rules={rules} settings={settings} style="form-control" />
            </div>
        </div>

        <div className='row'>
            <div className='col-2'>&nbsp;</div>
            <div className='col-9 d-flex'>
                <button type='button' className='btn btn-light' onClick={() => input.current?.clearValidation()}>Clear Validation</button>
            </div>
        </div>
    </div>;
}