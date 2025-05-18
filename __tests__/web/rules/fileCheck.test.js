/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {fileCheck} from '../../../web/rules/FileCheck';
import {file0, txt900, ico1000, xml2K, html3K} from './files';
jest.mock('./files');

test('validation: fileCheck rule', () => {
    let rule = fileCheck(
        (files, calculateSize) => {
            const minSize = calculateSize({size: 1.5, unit: 'K'});
            for (let file of files) if (file.size < minSize) return false;
            return true;
        },
        'File size is too small'
    );
    
    expect(rule.setValue(ico1000).validate().isValid).toBe(false);
    expect(rule.setValue(xml2K).validate().isValid).toBe(true);
    expect(rule.setValue([file0, txt900, ico1000]).validate().isValid).toBe(false);
    expect(rule.setValue([xml2K, ico1000, html3K]).validate().isValid).toBe(false);
    expect(rule.setValue([xml2K, html3K]).validate().isValid).toBe(true);
    expect(rule.errorMessage).toBe('File size is too small');
});