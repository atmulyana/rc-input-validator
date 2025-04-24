/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {fileExt, fileType} from '../../../web/rules/fileType';
import {file0, txt900, ico1000, xml2K, html3K} from './files';
jest.mock('./files');

test('validation: fileExt rule', () => {
    let rule = fileExt("");
    expect(rule.setValue(file0).validate().isValid).toBe(true);
    expect(rule.setValue(txt900).validate().isValid).toBe(false);
    expect(rule.setValue([file0, file0]).validate().isValid).toBe(true);
    expect(rule.setValue([file0, txt900]).validate().isValid).toBe(false);

    rule = fileExt('txt');
    expect(rule.setValue(file0).validate().isValid).toBe(false);
    expect(rule.setValue(txt900).validate().isValid).toBe(true);
    expect(rule.setValue(ico1000).validate().isValid).toBe(false);
    expect(rule.setValue([file0, txt900]).validate().isValid).toBe(false);
    expect(rule.setValue([txt900, txt900]).validate().isValid).toBe(true);
    expect(rule.setValue([txt900, ico1000]).validate().isValid).toBe(false);

    rule = fileExt(['', 'ico', '.xml']);
    expect(rule.setValue(file0).validate().isValid).toBe(true);
    expect(rule.setValue(txt900).validate().isValid).toBe(false);
    expect(rule.setValue(ico1000).validate().isValid).toBe(true);
    expect(rule.setValue(xml2K).validate().isValid).toBe(true);
    expect(rule.setValue([file0, txt900]).validate().isValid).toBe(false);
    expect(rule.setValue([file0, ico1000]).validate().isValid).toBe(true);
    expect(rule.setValue([file0, ico1000, xml2K]).validate().isValid).toBe(true);
    expect(rule.setValue([html3K, txt900]).validate().isValid).toBe(false);

    rule = fileExt(['.ico', 'html']);
    expect(rule.setValue(file0).validate().isValid).toBe(false);
    expect(rule.setValue(txt900).validate().isValid).toBe(false);
    expect(rule.setValue(ico1000).validate().isValid).toBe(true);
    expect(rule.setValue(html3K).validate().isValid).toBe(true);
    expect(rule.setValue([file0, txt900]).validate().isValid).toBe(false);
    expect(rule.setValue([txt900, ico1000]).validate().isValid).toBe(false);
    expect(rule.setValue([ico1000, html3K]).validate().isValid).toBe(true);
    expect(rule.setValue([ico1000, html3K, file0]).validate().isValid).toBe(false);
});

test('validation: fileType rule', () => {
    let rule = fileType("text/plain");
    expect(rule.setValue(file0).validate().isValid).toBe(false);
    expect(rule.setValue(txt900).validate().isValid).toBe(true);
    expect(rule.setValue([file0, txt900]).validate().isValid).toBe(false);
    expect(rule.setValue([txt900, txt900]).validate().isValid).toBe(true);

    rule = fileType(["text/plain", 'image/ico']);
    expect(rule.setValue(file0).validate().isValid).toBe(false);
    expect(rule.setValue(txt900).validate().isValid).toBe(true);
    expect(rule.setValue(ico1000).validate().isValid).toBe(true);
    expect(rule.setValue([file0, txt900]).validate().isValid).toBe(false);
    expect(rule.setValue([txt900, ico1000]).validate().isValid).toBe(true);
    expect(rule.setValue([txt900, ico1000, xml2K]).validate().isValid).toBe(false);

    rule = fileType(type => type.startsWith('text/'));
    expect(rule.setValue(file0).validate().isValid).toBe(false);
    expect(rule.setValue(txt900).validate().isValid).toBe(true);
    expect(rule.setValue(ico1000).validate().isValid).toBe(false);
    expect(rule.setValue(xml2K).validate().isValid).toBe(true);
    expect(rule.setValue(html3K).validate().isValid).toBe(true);
    expect(rule.setValue([file0, txt900]).validate().isValid).toBe(false);
    expect(rule.setValue([txt900, xml2K]).validate().isValid).toBe(true);
    expect(rule.setValue([txt900, xml2K, html3K]).validate().isValid).toBe(true);
    expect(rule.setValue([txt900, ico1000, xml2K, html3K]).validate().isValid).toBe(false);
});