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
import styles from '../styles';

const rules1 = [required, numeric, integer, min(5)];
const messageFunc = () => 'Enter a round number with minimum value of 5'; // or `setErrorMessage('Enter a round number with minimum value of 5')` 
const rules2 = [
    new Required().setMessageFunc(messageFunc),
    new Numeric().setMessageFunc(messageFunc),
    new Integer().setMessageFunc(messageFunc),
    min(5).setMessageFunc(messageFunc),
];
const inputStyle = styles.textInputWidth(60);

export default function setMessageFuncPage() {
    const validation = React.useRef<ContextRef>(null);

    return <form style={styles.form} onSubmit={ev => ev.preventDefault()}>
    <ValidationContext ref={validation}>
        <h3 style={styles.title}>The Benefit of <code>setMessageFunc</code></h3>
        <div style={styles.description}>To validate an input, often, we need some rules. However, each rule comes with its own
        error message which is specific to each rule. It can cause the prolix messages.<br/>
        The first input gives the prolix messages: when you don't fill anything, it asks to be filled. When you enter
        a non-numeric value, it asks a numeric value. When you enter a fractional number, it asks a round number. When you enter
        a round number below 5, it asks 5 at minimum.<br/>
        The second input uses <code style={styles.textCode}>setMessageFunc</code> to make a more straightforward message that it
        wants a round number with minimum value of 5. <code style={styles.textCode}>setMessageFunc</code> may be replaced
        by <code style={styles.textCode}>setErrorMessage</code> if the message is simple without needing any parameter.
        </div>

        <div style={styles.inputRow}>
            <label style={styles.label}>Prolix</label>
            <Input type='text' style={inputStyle} rules={rules1} />
        </div>

        <div style={styles.inputRow}>
            <label style={styles.label}>Straightforward</label>
            <Input type='text' style={inputStyle} rules={rules2} />
        </div>

        <div style={styles.inputRow}>
            <label style={styles.label}>&nbsp;</label>
            <div style={styles.buttonContainer}>
                <button style={styles.text} onClick={() => validation.current?.validate()}>Validate</button>
                <button style={styles.text} type='button' onClick={() => validation.current?.clearValidation()}>Clear Validation</button>
            </div>
        </div>
    </ValidationContext>
    </form>;
}