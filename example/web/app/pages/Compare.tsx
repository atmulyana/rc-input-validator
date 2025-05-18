/**
 * Example of how to use rc-input-validator package
 * https://github.com/atmulyana/rc-input-validator
 */
import React from 'react';
import {
    required,
    rule,
    length,
} from 'rc-input-validator/rules';
import type {
    ContextRef,
    InputRef,
} from 'rc-input-validator/types';
import {
    Input,
    ValidationContext,
} from 'rc-input-validator/web';
import styles from '../styles';

export default class extends React.Component {
    formRef = React.createRef<HTMLFormElement>();
    validationRef = React.createRef<ContextRef>();
    passwordRef = React.createRef<InputRef & HTMLInputElement>();

    render() {
        const validNotif = () => window.alert('All inputs are valid');
        
        return <form ref={this.formRef} style={styles.form} onSubmit={ev => ev.preventDefault()}> 
        <ValidationContext ref={this.validationRef}>
            <h3 style={styles.title}>`Compare` Rule</h3>
            <div style={styles.description}>You usually encounter these inputs when you want to register to be a user of an application.
            You need to input (create new) a password for the application and then re-type the same password in the second input.
            It's to make sure that the password you typed is really what you mean.</div>

            <div style={styles.inputRow}>
                <label style={styles.label}>Password</label>
                <Input type='password' ref={this.passwordRef} name='password' style={styles.textInput1} autoComplete='new-password'
                    rules={[
                        required,
                        length(8),
                        rule<string>(
                            value => {
                                return /[a-z]/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^a-zA-Z\d\s]/.test(value);
                            },
                            'The password must contain capital and non capital letter, number and non-alphanumeric characters'
                        ),
                    ]}
                 />
                <div style={styles.flex2}>&nbsp;</div>
            </div>

            <div style={styles.inputRow}>
                <label style={styles.label}>Confirm Password</label>
                <Input type='password' name='confirmPassword' style={styles.textInput1} autoComplete='new-password'
                    rules={[
                        /*Required.If*/required.if(() => this.passwordRef.current?.isValid ?? false),
                        rule(
                            value => this.passwordRef.current?.value === value,
                            'must be the same as `Password` above'
                        ),
                    ]}
                />
                <div style={styles.flex2}>&nbsp;</div>
            </div>

            <div style={styles.inputRow}>
                <label style={styles.label}>&nbsp;</label>
                <div style={styles.buttonContainer}>
                    <button
                        onClick={() => this.validationRef.current?.validate() && validNotif()}
                        style={styles.button}
                    >Validate</button>
                    <button
                        onClick={() => {
                            if (!this.formRef.current) return;
                            fetch('http://localhost:1234/check-password', {
                                body: JSON.stringify(
                                    Object.fromEntries(
                                        new FormData(this.formRef.current)
                                    )
                                ),
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                }
                            })
                            .then(async (response) => {
                                this.validationRef.current?.clearValidation();
                                if (response.ok) validNotif();
                                else if (response.status == 400) {
                                    const errors = await response.json();
                                    for (let inputName in errors) {
                                        this.validationRef.current?.setErrorMessage(inputName, errors[inputName]);
                                    }
                                    if (this.validationRef.current?.isValid) {
                                        //Although, the response status is invalid but no error message provided.
                                        //Therefore, we consider all inputs are valid.
                                        validNotif();
                                    }
                                }
                                else {
                                    window.alert('Server response is not OK');
                                }
                            })
                            .catch(err => {
                                console.log(err)
                                window.alert('An error happened. Please run the server (read the note below the buttons)');
                            })
                        }}
                        style={styles.button}
                    >Validate on server</button>
                    <button
                        onClick={() => this.validationRef.current?.clearValidation()}
                        style={styles.button}
                    >Clear Validation</button>
                </div>
            </div>

            <div>
                NOTE: To execute "Validate on server", you must run the server included in this example.
                Turn off your firewall for a while, before starting the server. It may block the connection.<br/>
                From the top folder of package, run the following commands:<br/>
                <pre style={styles.textCode}>
                &nbsp;&nbsp;&nbsp;&nbsp;npm run build<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;node example/server.js<br/>
                </pre>
            </div>
        </ValidationContext>
        </form>;
    }
}