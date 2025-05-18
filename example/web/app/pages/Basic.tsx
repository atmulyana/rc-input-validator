/**
 * Example of how to use rc-input-validator package
 * https://github.com/atmulyana/rc-input-validator
 */
import React from 'react';
import {isFilled} from 'rc-input-validator/helpers';
import {
    alwaysValid,
    integer,
    max,
    min,
    numeric,
    regex,
    required,
    Required,
    rule,
} from 'rc-input-validator/rules';
import {date} from 'rc-input-validator/rules/date';
import {time} from 'rc-input-validator/rules/time';
import type {ContextRef, Rule} from 'rc-input-validator/types';
import {
    CheckBoxes,
    Form,
    Input,
    Select,
    RadioButtons,
    Validation,
} from 'rc-input-validator/web';
import styles from '../styles';

const genderOptions = [
    {value: 'M', label: 'Male'},
    {value: 'F', label: 'Female'},
];
const hobbyOptions = ['Music', 'Movie', 'Sport', 'Other'];

function addYear(date: Date, yearsToAdd: number): Date {
    let year = date.getFullYear() + yearsToAdd;
    return new Date(year, date.getMonth(), date.getDate());
}

const dobRules = [
    new Required().setErrorMessage("Invalid date"),
    date("yyyy-MM-dd"), //or just `date()` because "yyyy-MM-dd" pattern is default
    max(() => addYear(new Date(), -21)).setErrorMessage('The employee must be at least 21 years old'),
    min(() => addYear(new Date(), -60)).setErrorMessage('The employee must be retired at 60 years old'),
];

const timeRule =  time("hh:mm"); //or just `time()` because "hh:mm" pattern is default
const shifts = [
    timeRule.parse('7:30')?.getTime(),
    timeRule.parse('13:00')?.getTime(),
    timeRule.parse('18:30')?.getTime(),
];
const shiftRules = [
    new Required().setErrorMessage("Invalid time"),
    timeRule,
    rule(
        value => {
            const val = value as Date | null;
            return shifts.includes(val?.getTime());
        },
        'invalid shift'
    ),
]; 

export default function BasicPage() {
    const formRef = React.useRef<HTMLFormElement & ContextRef>(null);
    const [domicile, setDomicile] = React.useState('xyz');
    const [hobbies, setHobbies] = React.useState<string | readonly string[]>('xyz');
    const [confirm, setConfirm] = React.useState(false);

    return <Form ref={formRef} contextProps={{focusOnInvalid: true}} style={styles.form} onSubmit={ev => ev.preventDefault()}>
        <h3 style={styles.title}>Employee Data Form</h3>
        <div style={styles.description}>
            It's a weird employee data form but, here, we're focusing on how the input validation works.
        </div>

        <div style={styles.inputRow}>
            <label style={Object.assign({}, styles.label, {paddingTop: 20})}>Full Name</label>
            <FullName />
        </div>
        
        <div style={styles.inputRow}>
            <label style={styles.label}>Date of Birth</label>
            <Input type="date" style={styles.textInputWidth(160)} rules={dobRules} />
        </div>

        <div style={styles.inputRow}>
            <label style={styles.label}>Gender</label>
            <RadioButtons horizontal options={genderOptions} rules={required} style={{$cover: styles.flex3}} />
        </div>

        <div style={styles.inputRow}>
            <label style={styles.label}>Number of Children</label>
            <Input type='text' maxLength={3} style={styles.textInputWidth(40)}
                rules={[
                    numeric,
                    integer,
                    min(0),
                    max(4).setMessageFunc(() => 'Maximum 4 children who get allowance'),
                ]} 
            />
        </div>

        <div style={styles.inputRow}>
            <label style={styles.label}>Domicile</label>
            <Select rules={required} style={styles.textInput1}
                value={domicile} onChange={ev => setDomicile(ev.target.value)}
            >
                <option value="">--Please Choose--</option>
                <option value="center">Center Area</option>
                <option value="east">East Area</option>
                <option value="north">North Area</option>
                <option value="south">South Area</option>
                <option value="west">West Area</option>
            </Select>
            <div style={styles.flex2}></div>
        </div>

        <div style={styles.inputRow}>
            <label style={styles.label}>How to go to office</label>
            <Select
                rules={[
                    rule(
                        value => {
                            if (value == 'foot') {
                                return domicile == 'center' || domicile === '';
                            }
                            return true;
                        },
                        "It's impossible to go to the office on foot based the selected domicile"
                    ),
                    required,
                ]}
                style={styles.textInput1}
            >
                <option value="">--Please Choose--</option>
                <option value="public">Public Transportation</option>
                <option value="private">Private Vehicle</option>
                <option value="foot">On Foot</option>
            </Select>
            <div style={styles.flex2}></div>
        </div>
        
        <div style={styles.inputRow}>
            <label style={styles.label}>Preferred Shift</label>
            <Input type='time' style={styles.textInputWidth(100, 'flex1')} rules={shiftRules}/>
            <div style={Object.assign({paddingTop: 8}, styles.flex2, styles.textSmall)}>
                &nbsp;&nbsp;Please choose 7:30, 13:00 or 18:30
            </div>
        </div>

        <div style={styles.inputRow}>
            <label style={styles.label}>Preferred Group</label>
            <div style={styles.flex1}>
                <Select multiple size={4} style={styles.textBorder}
                    rules={[
                        required,
                        rule(
                            value => {
                                let vals = value as (string[] | string);
                                if (!Array.isArray(vals)) vals = [vals];
                                if (vals.length == 2) {
                                    const num1 = parseInt(vals[0]), num2 = parseInt(vals[1]);
                                    if (isNaN(num1) || isNaN(num2)) return false;
                                    if ((num1 % 2) != (num2 % 2)) return 'Two odd or two even numbers';         
                                }
                                else if (vals.length > 2) {
                                    return 'Not more than two numbers';
                                }
                                return true;
                            }
                        )
                    ]}
                >
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                    <option value="4">Four</option>
                </Select>
            </div>
            <div style={Object.assign({alignSelf: 'flex-end', paddingBottom: 16}, styles.flex2, styles.textSmall)}>
                &nbsp;&nbsp;Please choose one or two numbers, both numbers must be odd or even
            </div>
        </div>

        <div style={styles.inputRow}>
            <label style={styles.label}>Hobby</label>
            <CheckBoxes rules={alwaysValid} options={hobbyOptions} style={{$cover: styles.flex1}} value={hobbies}
                settings={{
                    setStatusStyle: (props, style, context) => {
                        const setValidStyle = () => {
                            props.style = Object.assign({}, context.normalStyle, {
                                borderColor: 'green',
                                borderStyle: 'solid',
                                borderWidth: 1,
                                color: 'green',
                            });
                        };

                        if (style) { //invalid status after validate or re-render when invalid (never happens because of `alwaysValid` rule)
                            return null;
                        }
                        else if (style === null) {  //valid status after `validate` action
                            if (!isFilled(props.value)) {
                                setValidStyle();
                                context.flag = 1;
                                return <span style={{color: 'green'}}><b>No hobbies!!!</b> It's ok.</span>;
                            }
                            return null;
                        }
                        else { //clear action or re-render when valid
                            if (style === false) { // re-render such as because of editing value
                                if (context.flag === 1) { //It's set above when valid after `validate` action
                                    /** Not like invalid status which is automatically cleared when starts editing, valid status needs manually clearing */
                                    context.clearValidation(); //This method is just to ask to clear in the next/current editing (not really to clear) 
                                    context.flag = 2;
                                }
                            }
                            else { //`input.clearValidation` was invoked
                                context.flag = 0;
                            }
                            
                            if (context.flag === 0) { //`0` is initial flag
                                props.style = context.normalStyle;
                            }
                            else {
                                setValidStyle();
                            }
                            return null;
                        }
                    },
                }}
            />
            <div style={styles.flex2}><button type='button' onClick={() => setHobbies([])}>Clear</button></div>
        </div>
        
        <div style={styles.inputRow}>&nbsp;</div>
        <div style={styles.inputRow}>
            <div style={styles.flex1}>&nbsp;</div>
            <div style={Object.assign({}, styles.flex3, styles.vertical)}>
                <div style={{alignItems: 'center', display: 'flex'}}>
                    <input id="confirmCheck" type='checkbox' checked={confirm} onChange={ev => setConfirm(ev.target.checked)} />
                    <label htmlFor='confirmCheck' style={styles.text}>&nbsp;All data I filled above is true</label>
                </div>
                <Validation
                    rules={rule(
                        checked => !!checked,
                        'You must check this statement'
                    )}
                    value={confirm}
                />
            </div>
        </div>

        <div style={styles.inputRow}>
            <div style={styles.flex1}>&nbsp;</div>
            <div style={styles.buttonContainer}>
                <button type='submit' style={styles.text}>Validate</button>
                <button type='button' style={styles.text} onClick={() => formRef.current?.clearValidation()}>Clear Validation</button>
            </div>
        </div>
    </Form>;
}

const reqiredNameRule = [
    required,
    regex(/^[a-zA-Z]+$/),
];
const middleNameRule = regex(/^[a-zA-Z]+( [a-zA-Z]+)*$/);

/** It's not necessary to create the separated components to show the input of name. Here, however, we're testing the nested inputs.*/
class FullName extends React.PureComponent {
    render() {
        return (
            <div style={styles.name}>
                <NamePart rules={reqiredNameRule} title="First" />
                <NamePart rules={middleNameRule} title="Middle" />
                <NamePart rules={reqiredNameRule} title="Last" />
            </div>
        );
    }
}
class NamePart extends React.PureComponent<{
    rules: Rule | Rule[],
    title: string,
}> {
    render() {
        const props = this.props;
        return(
            <div style={styles.namePart}>
                <label style={styles.textSmall}>{props.title}</label>
                <Input rules={props.rules} type='text' style={styles.textInput} />
            </div>
        );
    }
}