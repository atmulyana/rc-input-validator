/**
 * Example of how to use rc-input-validator package
 * https://github.com/atmulyana/rc-input-validator
 */
import React from 'react';
import {
    email,
    required,
} from 'rc-input-validator/rules';
import type {ContextRef} from 'rc-input-validator/types';
import {
    Input,
    ValidationContext,
} from 'rc-input-validator/web';
import styles from '../styles';

export default function AutoPage() {
    const validation = React.useRef<ContextRef>(null);
    const [isAuto, setAuto] = React.useState(true);

    return <form style={styles.form} onSubmit={ev => ev.preventDefault()}>
    <ValidationContext ref={validation} auto={isAuto} focusOnInvalid={true}>
        <h3 style={styles.title}>Auto Validation</h3>
        <div style={styles.description}>Enter the email address to both inputs.</div>

        <div style={styles.inputRow}>
            <label style={styles.label}>
                {isAuto ? 'Auto' : 'Not Auto'}&nbsp;
                <small style={styles.textSmall}>(follows the context' setting)</small>
            </label>
            <Input type='text' style={styles.textInput} rules={email} />
        </div>

        <div style={styles.inputRow}>
            <label style={styles.label}>
                {isAuto ? 'Not Auto' : 'Auto'}&nbsp;
                <small style={styles.textSmall}>(input's own setting)</small>
            </label>
            {isAuto
                ? <Input key={1} type='text' style={styles.textInput} rules={[email, required]} settings={{auto: false}} />
                : <Input key={2} type='text' style={styles.textInput} rules={[email, required]} settings={{auto: true}} />
            }
        </div>

        <div style={styles.inputRow}>
            <label style={styles.label}>&nbsp;</label>
            <div style={styles.buttonContainer}>
                <button type='button' style={styles.text} onClick={() => setAuto(auto => !auto)}>Switch Auto</button>
                <button style={styles.text} onClick={() => validation.current?.validate()}>Validate</button>
                <button style={styles.text}  type='button' onClick={() => validation.current?.clearValidation()}>Clear Validation</button>
            </div>
        </div>
    </ValidationContext>
    </form>;
}