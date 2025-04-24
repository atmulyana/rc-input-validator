/**
 * https://github.com/atmulyana/rc-input-validator
 */
export {default as ValidationRule} from './ValidationRule';
export {default as ValidationRuleAsync} from './ValidationRuleAsync';
export {CustomRule, rule} from './custom';
export {CustomRuleAsync, ruleAsync} from './customAsync';
//export {StrDate, date} from './date';  /**** Needs peer-dep ****/
export {Email, email} from './email';
export {HttpReq, httpReq} from './httpReq';
export {Integer, integer} from './integer';
export {Length, length, lengthMax} from './length';
export {Max, max} from './max';
export {Min, min} from './min';
export {Numeric, numeric} from './numeric';
export {Regex, regex} from './regex';
export {Required, required, alwaysValid} from './required';
//export {Time, time} from './time';  /**** Needs peer-dep ****/