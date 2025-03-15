/**
 * https://github.com/atmulyana/rc-input-validator
 *
 * @format
 */
import ValidationRule from '../../rules/ValidationRule';

class ARule extends ValidationRule {
    get errorMessage() {
        return 'invalid input';
    }
}

test("validation: `messageFunc` accesses `errorMessage` shouldn't cause recursive-call forever", () => {
    const rule = new ARule();
    
    rule.setMessageFunc(self => self.errorMessage + ' value');
    expect(rule.errorMessage).toBe('invalid input value');

    rule.setMessageFunc(() => '');
    expect(rule.errorMessage).toBe('invalid input');

    rule.setMessageFunc(() => 'just invalid');
    expect(rule.errorMessage).toBe('just invalid');
});