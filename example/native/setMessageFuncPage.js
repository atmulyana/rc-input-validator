/**
 * Example of how to use rc-input-validator package
 * https://github.com/atmulyana/rc-input-validator
 */
import * as React from 'react';
import {
    Button,
    Text,
    TextInput,
    View,
} from 'react-native';
import styles from './styles';
import {
    ValidationContext,
    withValidation
} from "rc-input-validator/native";
import {
    integer,
    Integer,
    min,
    numeric,
    Numeric,
    required,
    Required,
} from 'rc-input-validator/rules';

const Input1 = withValidation(TextInput, [required, numeric, integer, min(5)]);
const messageFunc = () => 'Enter a round number with minimum value of 5';
const Input2 = withValidation(TextInput, [
    new Required().setMessageFunc(messageFunc),
    new Numeric().setMessageFunc(messageFunc),
    new Integer().setMessageFunc(messageFunc),
    min(5).setMessageFunc(messageFunc),
]);

export default function() {
    const validation = React.useRef(null);
    const [value1, setValue1] = React.useState('');
    const [value2, setValue2] = React.useState('');

    return <ValidationContext ref={validation}>
        <Text style={styles.title}>The Benefit of setMessageFunc</Text>
        <Text style={styles.description}>To validate an input, often, we need some rules. However, each rule comes with its own
        error message which is specific to each rule. It can cause the prolix messages.{'\n'}
        The first input gives the prolix messages: when you don't fill anything, it asks to be filled. When you enter a non-numeric value, it asks a numeric
        value. When you enter a fractional number, it asks a round number. When you enter a round number below 5, it asks 5 at minimum.{'\n'}
        The second input uses `setMessageFunc` to make a more straightforward message that it wants a round number with minimum value of 5.
        `setMessageFunc` may be replaced by `setErrorMessage` if the message is simple without needing any parameter.
        </Text>

        <View style={styles.inputRow}>
            <Text style={styles.label}>Prolix</Text>
            <Input1 onChangeText={setValue1} style={styles.textInput} value={value1} />
        </View>
        <View style={styles.inputRow}>
            <Text style={styles.label}>Straightforward</Text>
            <Input2 onChangeText={setValue2} style={styles.textInput} value={value2} />
        </View>
        <View style={[styles.inputRow, {justifyContent: 'space-evenly'}]}>
            <Button onPress={() => validation.current?.validate()} title="Validate" />
            <Button onPress={() => validation.current?.clearValidation()} title="Clear Validation" />
        </View>
    </ValidationContext>;
}