/**
 * Example of how to use rc-input-validator package
 * https://github.com/atmulyana/rc-input-validator
 */
import React from 'react';
import {
    integer,
    Integer,
    min,
    numeric,
    Numeric,
    required,
    Required,
} from 'rc-input-validator/rules';
import type {ContextRef} from 'rc-input-validator/types';
import {
    Input,
    ValidationContext,
} from 'rc-input-validator/web';

const rules1 = [required, numeric, integer, min(5)];
const messageFunc = () => 'Enter a round number with minimum value of 5'; // or `setErrorMessage('Enter a round number with minimum value of 5')` 
const rules2 = [
    new Required().setMessageFunc(messageFunc),
    new Numeric().setMessageFunc(messageFunc),
    new Integer().setMessageFunc(messageFunc),
    min(5).setMessageFunc(messageFunc),
];

export default function setMessageFuncPage() {
    const validation = React.useRef<ContextRef>(null);

    return <form className='container mx-auto' onSubmit={ev => ev.preventDefault()}>
    <ValidationContext ref={validation}>
        <h3 className='fs-5 fw-bold lh-sm text-center mb-2'>The Benefit of <span className='font-monospace'>setMessageFunc</span></h3>
        <div className='mb-3'>To validate an input, often, we need some rules. However, each rule comes with its own
        error message which is specific to each rule. It can cause the prolix messages.<br/>
        The first input gives the prolix messages: when you don't fill anything, it asks to be filled. When you enter
        a non-numeric value, it asks a numeric value. When you enter a fractional number, it asks a round number. When you enter
        a round number below 5, it asks 5 at minimum.<br/>
        The second input uses <span className='font-monospace'>setMessageFunc</span> to make a more straightforward message that it
        wants a round number with minimum value of 5. <span className='font-monospace'>setMessageFunc</span> may be replaced
        by <span className='font-monospace'>setErrorMessage</span> if the message is simple without needing any parameter.
        </div>

        <div className='row mb-3'>
            <label className='col-2 col-form-label'>Prolix</label>
            <div className='col-4'>
                <Input type='text' style='form-control' rules={rules1} />
            </div>
        </div>

        <div className='row mb-3'>
            <label className='col-2 col-form-label'>Straightforward</label>
            <div className='col-4'>
                <Input type='text' style='form-control' rules={rules2} />
            </div>
        </div>

        <div className='row'>
            <label className='col-2'>&nbsp;</label>
            <div className='col-9 d-flex'>
                <button className='btn btn-primary me-4' onClick={() => validation.current?.validate()}>Validate</button>
                <button className='btn btn-light' type='button' onClick={() => validation.current?.clearValidation()}>Clear Validation</button>
            </div>
        </div> 
    </ValidationContext>
    </form>;
}