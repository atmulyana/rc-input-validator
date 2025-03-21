/**
 * https://github.com/atmulyana/rc-input-validator
 */
import type {LangFunction} from '../types';
import Rule from '../rules/Rule';
import {Required, ValidationRuleAsync} from '../rules';
import {isFilled} from './common';

function checkRule(
    value: unknown,
    rules: Array<Rule> | Rule,
    lang: LangFunction
): boolean | Array<Rule> {
    let arRule: Array<Rule>;
    if (Array.isArray(rules)) {
        arRule = rules;
    }
    else {
        if (rules instanceof Rule) //runtime check
            arRule = [rules];
        else return false;
    }

    let required: Nullable<Required>;
    arRule = arRule.filter(rule => {
        if (rule instanceof Required) required = rule;
        return rule instanceof Rule; //runtime check
    }).sort(
        (rule1: Rule, rule2: Rule) => (
            rule1.priority < rule2.priority ? -1 :
            rule1.priority > rule2.priority ? 1 :
            0
        )
    );
    if (arRule.length < 1) return false;
    
     //if optional and not filled then don't validate
    if (
        (
            !required //really optional 
            || (required.setValue(value).validate() as Rule).isValid //if the value is empty and valid then it's optional by a condition
        ) 
        && !isFilled(value)
    ) return true;

    Rule.prototype.lang = lang;
    return arRule;
}


export function validate(
    value: unknown,
    rules: Array<Rule> | Rule,
    name?: string|null,
    lang: LangFunction = Rule.defaultLang
): Nullable<boolean | string> {
    let arRule = checkRule(value, rules, lang);
    if (!Array.isArray(arRule)) return arRule;

    let val = value;
    for (let rule of arRule) {
        rule.name = name;
        rule.setValue(val);
        const sameRule = rule.validate();
        if (sameRule instanceof Promise) {
            let errMessage = "Call `validateAsync` to process asynchronous validation.";
            errMessage += ` \`validate\` method of \`${rule.constructor.name}\` rule returns a \`Promise\` object.`
            if (!(rule instanceof ValidationRuleAsync)) errMessage += " Also, the rule class doesn't inherit class `ValidationRuleAsync`."
            throw errMessage;
        }
        if (rule.isValid) {
            val = rule.resultValue; //the value (type) may have been converted
        }
        else {
            return rule.errorMessage;
        }
    }
    return true;
};


export async function validateAsync(
    value: unknown,
    rules: Array<Rule> | Rule,
    name?: string|null,
    lang: LangFunction = Rule.defaultLang
): Promise<Nullable<boolean | string>> {
    let arRule = checkRule(value, rules, lang);
    if (!Array.isArray(arRule)) return arRule;

    let val = value;
    for (let rule of arRule) {
        rule.name = name;
        rule.setValue(val);
        const promiseRule = rule.validate();
        if (promiseRule instanceof Promise) {
            await promiseRule;
        }
        if (rule.isValid) {
            val = rule.resultValue; //the value (type) may have been converted
        }
        else {
            return rule.errorMessage;
        }
    }
    return true;
}
