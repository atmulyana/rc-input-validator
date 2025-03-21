/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {StyleSheet, View} from 'react-native';
import type {StyleProp} from './types';
import {contextFactory, red} from '../Context';

const defaultStyle = StyleSheet.create({
    errorTextStyle: {
        color: red,
        flex: 0,
        fontFamily: 'Arial',
        fontSize: 12,
        lineHeight: 12,
        marginTop: 2,
    },
    inputErrorStyle: {
        borderColor: red,
        color: red,
    },
});
const {Context, ValidationContext} = contextFactory<StyleProp>({
    Container: View,
    ...defaultStyle
});
export {Context, ValidationContext};
