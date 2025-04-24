/**
 * https://github.com/atmulyana/rc-input-validator
 */
import type {Rule} from '../../types';
import messages from '../messages';
import FileCheck from './FileCheck';

function isNoExt(fileName: string) {
    return fileName.indexOf('.') < 0;
}

function isWithExt(fileName: string, ext: string) {
    return fileName.endsWith(`.${ext}`);
}

export const fileExt = (extension: string | readonly string[]): Rule<File | readonly File[]> => {
    const exts: readonly string[] = Array.isArray(extension) ? extension : [extension];
    const reLeadingDots = /^\.+/;
    const validators: {[ext: string]: (name: string, ext: string) => boolean} = {};
    for (let ext of exts) {
        ext = ext.trim().toLowerCase().replace(reLeadingDots, '');
        if (ext) validators[ext] = isWithExt;
        else validators["."] = isNoExt;
    }
    return new FileCheck(
        (files) => {
            for (let file of files) {
                let valid = false, fileName = file.name.toLowerCase();
                for (let ext in validators) valid ||= validators[ext](fileName, ext);
                if (!valid) return false;
            }
            return true;
        },
        messages.fileExt
    );
};

export const fileType = (type: string | readonly string[] | ((type: string) => boolean)) => {
    let arType: string[], lcType: string;
    const validate: (type: string) => boolean =
        typeof(type) == 'function' ? type :
        Array.isArray(type) ? (
            arType = type.map(type => type.toLowerCase()), 
            type2 => arType.includes(type2)
        ) : (
            lcType = (type as string).toLowerCase(), 
            type2 => lcType == type2
        );
    return new FileCheck(
        (files) => {
            for (let file of files) if (!validate(file.type.toLowerCase())) return false;
            return true;
        },
        messages.fileType
    );
}