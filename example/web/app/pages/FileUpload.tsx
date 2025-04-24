/**
 * Example of how to use rc-input-validator package
 * https://github.com/atmulyana/rc-input-validator
 */
import React from 'react';
import {required} from 'rc-input-validator/rules';
import {
    fileExt,
    fileMax,
    fileTotalMax,
    fileType,
} from 'rc-input-validator/web/rules';
import type {ContextRef} from 'rc-input-validator/types';
import {
    Form,
    Input,
} from 'rc-input-validator/web';
import styles from '../styles';

export default function FileUploadPage() {
    const validation = React.useRef<ContextRef & HTMLFormElement>(null);

    return <Form ref={validation} contextProps={{focusOnInvalid: true}} style={styles.form} onSubmit={ev => ev.preventDefault()}>
        <h3 style={styles.title}>File Upload</h3>

        <div style={styles.inputRow}>
            <label style={styles.label}>Document</label>
            <div style={Object.assign({}, styles.flex3, styles.vertical)}>
                <Input type='file' style={styles.textInput}
                    rules={[
                        required,
                        fileExt(['pdf', 'doc', 'docx']),
                        fileMax(50, 'k'),
                    ]}
                />
                <small style={styles.textSmall}>
                    Please select a .doc, .docx or .pdf file with maximum size is 50k.
                </small>
            </div>
        </div>

        <div style={styles.inputRow}>
            <label style={styles.label}>Images</label>
            <div style={Object.assign({}, styles.flex3, styles.vertical)}>
                <Input type='file' multiple style={styles.textInput}
                    rules={[
                        required,
                        fileType(type => type.startsWith('image/')),
                        fileTotalMax(1, 'M'),
                    ]}
                />
                <small style={styles.textSmall}>
                    Please some iamge files with maximum total size is 1M.
                </small>
            </div>
        </div>

        <div style={styles.inputRow}>
            <label style={styles.label}>&nbsp;</label>
            <div style={styles.buttonContainer}>
                <button style={styles.text} onClick={() => validation.current?.validate()}>Validate</button>
                <button style={styles.text}  type='button' onClick={() => validation.current?.clearValidation()}>Clear Validation</button>
            </div>
        </div>
    </Form>;
}