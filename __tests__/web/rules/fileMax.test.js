/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {fileMax, fileTotalMax} from '../../../web/rules/fileMax';
import {txt900, ico1000, xml2K, html3K, pdf4K, png5M, avi2G} from './files';
jest.mock('./files');

test('validation: fileMax rule', () => {
    expect(fileMax(950).setValue(txt900).validate().isValid).toBe(true);
    expect(fileMax(950).setValue(ico1000).validate().isValid).toBe(false);
    expect(fileMax(950).setValue([txt900, ico1000]).validate().isValid).toBe(false);
    expect(fileMax(1000).setValue([txt900, ico1000]).validate().isValid).toBe(true);

    expect(fileMax(3, 'k').setValue(xml2K).validate().isValid).toBe(true);
    expect(fileMax(3, 'K').setValue(html3K).validate().isValid).toBe(true);
    expect(fileMax(3, 'K').setValue(pdf4K).validate().isValid).toBe(false);
    expect(fileMax(3, 'k').setValue([xml2K, html3K, pdf4K]).validate().isValid).toBe(false);
    expect(fileMax(4, 'k').setValue([xml2K, html3K, pdf4K]).validate().isValid).toBe(true);

    expect(fileMax(4, 'm').setValue(png5M).validate().isValid).toBe(false);
    expect(fileMax(5, 'M').setValue([png5M]).validate().isValid).toBe(true);
    expect(fileMax(6, 'M').setValue(png5M).validate().isValid).toBe(true);

    expect(fileMax(1, 'g').setValue(avi2G).validate().isValid).toBe(false);
    expect(fileMax(2, 'G').setValue([avi2G]).validate().isValid).toBe(true);
    expect(fileMax(3, 'G').setValue(avi2G).validate().isValid).toBe(true);
});

test('validation: fileTotalMax rule', () => {
    expect(fileTotalMax(1800).setValue([txt900, ico1000]).validate().isValid).toBe(false);
    expect(fileTotalMax(1900).setValue([txt900, ico1000]).validate().isValid).toBe(true);
    expect(fileTotalMax(2000).setValue([txt900, ico1000]).validate().isValid).toBe(true);

    expect(fileTotalMax(8, 'k').setValue([xml2K, html3K, pdf4K]).validate().isValid).toBe(false);
    expect(fileTotalMax(9, 'K').setValue([xml2K, html3K, pdf4K]).validate().isValid).toBe(true);
    expect(fileTotalMax(10, 'K').setValue([xml2K, html3K, pdf4K]).validate().isValid).toBe(true);

    expect(fileTotalMax(4, 'M').setValue(png5M).validate().isValid).toBe(false);
    expect(fileTotalMax(5, 'M').setValue(png5M).validate().isValid).toBe(true);
    expect(fileTotalMax(6, 'm').setValue(png5M).validate().isValid).toBe(true);
});