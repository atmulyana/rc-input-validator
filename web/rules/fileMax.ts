/**
 * https://github.com/atmulyana/rc-input-validator
 */
import type {Rule} from '../../types';
import messages from '../messages';
import FileCheck, {type TUnit} from './FileCheck';

export const fileMax = (max: number, unit?: TUnit) => (
    new FileCheck(
        (files, calculateSize) => {
            const maxSize = calculateSize({size: max, unit});
            for (let file of files) if (file.size > maxSize) return false;
            return true;
        },
        messages.fileMax
    ) as Rule<File | readonly File[]>
);

export const fileTotalMax = (max: number, unit?: TUnit) => (
    new FileCheck(
        (files, calculateSize) => {
            const maxSize = calculateSize({size: max, unit});
            const totalSize = files.reduce(
                (size, file) => size + file.size,
                0
            );
            return totalSize <= maxSize;
        },
        messages.fileTotalMax
    ) as Rule<File | readonly File[]>
);