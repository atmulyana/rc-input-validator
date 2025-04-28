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
    getStyleProps,
    Input,
    Select,
    RadioButtons,
    Validation,
} from 'rc-input-validator/web';
import {contextProps} from './options';

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
    const [confirm, setConfirm] = React.useState(false);
    
    return <Form ref={formRef} contextProps={contextProps} className='container mx-auto' onSubmit={ev => ev.preventDefault()}>
        <h3 className='fs-5 fw-bold lh-sm text-center mb-2'>Employee Data Form</h3>
        <div className='mb-3'>
            It's a weird employee data form but, here, we're focusing on how the input validation works.
        </div>

        <div className='row mb-3'>
            <div className='col-2 d-flex flex-column'>
                <small className='lh-sm'>&nbsp;</small>
                <label className='col-form-label'>Full Name</label>
            </div>
            <FullName />
        </div> 
        
        <div className='row mb-3'>
            <label className='col-2 col-form-label'>Date of Birth</label>
            <div className='col-9 d-flex flex-column'>
                <Input type="date" style='form-control w-25' rules={dobRules} />
            </div>
        </div>

        <div className='row mb-3'>
            <label className='col-2 col-form-label'>Gender</label>
            <div className='col-9'>
                <RadioButtons horizontal options={genderOptions} rules={required} />
            </div>
        </div>

        <div className='row mb-3'>
            <label className='col-2 col-form-label'>Number of Children</label>
            <div className='col-9 d-flex flex-column'>
                <Input type='text' maxLength={3} style={{$class: 'form-control', $style: {width: 60}}}
                    rules={[
                        numeric,
                        integer,
                        min(0),
                        max(4).setMessageFunc(() => 'Maximum 4 children who get allowance'),
                    ]} 
                />
            </div>
        </div>

        <div className='row mb-3'>
            <label className='col-2 col-form-label'>Domicile</label>
            <div className='col-3' style={{paddingRight: 0}}>
                <Select id='domiileOptions' rules={required} style='form-control'>
                    <option value="">--Please Choose--</option>
                    <option value="center">Center Area</option>
                    <option value="east">East Area</option>
                    <option value="north">North Area</option>
                    <option value="south">South Area</option>
                    <option value="west">West Area</option>
                </Select>
            </div>
        </div>

        <div className='row mb-3'>
            <label className='col-2 col-form-label'>How to go to office</label>
            <div className='col-9 d-flex flex-column'>
                <Select
                    rules={[
                        rule(
                            value => {
                                const domicile = (document.getElementById('domiileOptions') as HTMLSelectElement)?.value;
                                if (value == 'foot') {
                                    return domicile == 'center' || domicile === '';
                                }
                                return true;
                            },
                            "It's impossible to go to the office on foot based the selected domicile"
                        ),
                        required,
                    ]}
                    style={{$class: 'form-control', $style: {width: '33%'}}}
                >
                    <option value="">--Please Choose--</option>
                    <option value="public">Public Transportation</option>
                    <option value="private">Private Vehicle</option>
                    <option value="foot">On Foot</option>
                </Select>
            </div>
        </div>
        
        <div className='row mb-3'>
            <label className='col-2 col-form-label'>Preferred Shift</label>
            <div className='col-2'>
                <Input type='time' style='form-control' rules={shiftRules}/>
            </div>
            <div className='col-7 col-form-label'>
                &nbsp;&nbsp;<small>Please choose 7:30, 13:00 or 18:30</small>
            </div>
        </div>

        <div className='row mb-3'>
            <label className='col-2 col-form-label'>Preferred Group</label>
            <div className='col-3'>
                <Select multiple size={4} style='form-control'
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
            <small className='col-6 align-self-end mb-4'>
                &nbsp;&nbsp;Please choose one or two numbers, both numbers must be odd or even
            </small>
        </div>

        <div className='row mb-3'>
            <label className='col-2 col-form-label'>Hobby</label>
            <div className='col-3'>
                <CheckBoxes rules={alwaysValid} options={hobbyOptions} 
                    settings={{
                        setStatusStyle: (props, style, context) => {
                            const setValidStyle = () => {
                                props.className = 'text-success border border-success';
                            };

                            if (style) { //invalid status after validate or re-render when invalid (never happens because of `alwaysValid` rule)
                                return null;
                            }
                            else if (style === null) {  //valid status after `validate` action
                                if (!isFilled(props.value)) {
                                    setValidStyle();
                                    context.flag = 1;
                                    return <span className='text-success'><b>No hobbies!!!</b> It's ok.</span>;
                                }
                                return null;
                            }
                            else { //clear action or re-render when valid
                                if (style === false) { // re-render such as because of editing value
                                    if (context.flag === 1) { //It's set above when valid after `validate` action
                                        //** Not like invalid status which is automatically cleared when starts editing, valid status needs manually clearing
                                        context.clearValidation(); //This method is just to ask to clear in the next/current editing (not really to clear) 
                                        context.flag = 2;
                                    }
                                }
                                else { //`input.clearValidation` was invoked
                                    context.flag = 0;
                                }
                                
                                if (context.flag === 0) { //`0` is initial flag
                                    Object.assign(props, getStyleProps(context.normalStyle));
                                }
                                else {
                                    setValidStyle();
                                }
                                return null;
                            }
                        },
                    }}
                />
            </div>
        </div>
        
        <div className='mb-3'>&nbsp;</div>
        <div className='row mb-3'>
            <div className='col-2'>&nbsp;</div>
            <div className='col-9 d-flex flex-column'>
                <div className='d-flex align-items-start'>
                    <input id="confirmCheck" type='checkbox' checked={confirm} onChange={ev => setConfirm(ev.target.checked)} />
                    <label htmlFor='confirmCheck' className='lh-1'>&nbsp;All data I filled above is true</label>
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

        <div className='row'>
            <div className='col-2'>&nbsp;</div>
            <div className='col-9 d-flex'>
                <button type='submit' className='btn btn-primary me-4'>Validate</button>
                <button type='button' className='btn btn-light' onClick={() => formRef.current?.clearValidation()}>Clear Validation</button>
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
            <div className='d-flex col-9'>
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
            <div className='d-flex flex-column col'>
                <small className='lh-sm'>{props.title}</small>
                <Input rules={props.rules} type='text' style='form-control' />
            </div>
        );
    }
}