/**
 * https://github.com/atmulyana/rc-input-validator
 */
import type {CSSProperties} from 'react';
import {red} from '../Context';
import type {StyleProp} from './types';

export const defaultStyle: {[p: string]: CSSProperties} = {
    container: {
        alignItems: 'stretch',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        position: 'relative',
    },
    checkedInputs: {
        alignContent: 'flex-start',
        columnGap: '16px',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        rowGap: '8px',
        justifyContent: 'flex-start',
    },
    errorText: {
        color: red,
        flex: 'none',
        fontFamily: 'Arial',
        fontSize: '14px',
        lineHeight: '14px',
        marginTop: '2px',
    },
    inputError: {
        borderColor: red,
        color: red,
    },
};

export function getStyleProps(style: StyleProp | Array<StyleProp>, ...restStyle: Array<StyleProp>) {
    const classNames: string[] = [],
          styleObj: CSSProperties = {};
    
    function collectStyle(s: StyleProp) {
        if (s) {
            if (typeof(s) == 'string') classNames.push(s);
            else if (typeof(s) == 'object') {
                if ('$class' in s) {
                    classNames.push(s.$class);
                    Object.assign(styleObj, s.$style);
                }
                else {
                    Object.assign(styleObj, s);
                }
            }
        }
    }

    if (Array.isArray(style)) {
        for (let s of style) collectStyle(s);
    }
    else {
        collectStyle(style);
    }
    for (let s of restStyle) collectStyle(s);

    const props: {
        className: string | undefined,
        style: CSSProperties | undefined,
    } = {
        className: undefined,
        style: undefined,
    };
    if (classNames.length > 0) props.className = classNames.join(' ');
    for (let _ in styleObj) {
        props.style = styleObj;
        break;
    }

    return props;
}