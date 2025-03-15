/**
 * https://github.com/atmulyana/rc-input-validator
 * 
 * It's to fix the bug in the current version that the original `CheckBox` cannot
 * be (un)checked by the `press` action on Android.
 */
import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import ReactCheckBox from '@react-native-community/checkbox';

const styles = StyleSheet.create({
    pressable: {
        flex: 0,
        padding: 0,
    },
    view: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0,
    },
});

const CheckBox = React.memo(function _CheckBox({onValueChange, value = false, ...props}) {
    const pressHandler = React.useCallback(() => {
        if (typeof(onValueChange) == 'function') onValueChange(!value);
    });
    
    return <Pressable hitSlop={0} pressRetentionOffset={0} style={styles.pressable} onPress={pressHandler}>
        <ReactCheckBox value={value} {...props} />
        <View style={styles.view} />
    </Pressable>
});
export default CheckBox;