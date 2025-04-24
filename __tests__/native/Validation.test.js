/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {act, cleanup, render, screen} from '@testing-library/react-native';
import {StyleSheet, Text, View} from "react-native";
import {Validation} from "../../native/Validation";
import {rule} from '../../rules';

let valRef;
const Form = ({value}) =>
    <View style={StyleSheet.absoluteFill}>
        <Validation ref={ref => valRef = ref}
            rules={rule(val => !!val)}
            testID="validation"
            value={value} />
    </View>;

afterEach(cleanup);

test('render Value with actual value', () => {
    render(<Form value={false} />);
    
    //expect(screen.toJSON()).toMatchSnapshot();

    const form = screen.root;
    const input = form.findByType(Validation);
    expect(input.props.value).toEqual(false);
    expect(() => input.findByType(Text)).toThrow(); //no error message
    
    act(() => {
        valRef.validate();
    });
    expect(() => input.findByType(Text)).not.toThrow(); //an error message exists
});

test('render Value with value as function', () => {
    let value = true;
    render(<Form value={() => value} />);
    
    //expect(screen.toJSON()).toMatchSnapshot();

    const form = screen.root;
    const input = form.findByType(Validation);
    expect(typeof(input.props.value)).toEqual('function');
    expect(() => input.findByType(Text)).toThrow(); //no error message
    
    expect(input.props.value()).toEqual(true);
    act(() => {
        valRef.validate();
    });
    expect(() => input.findByType(Text)).toThrow(); //no error message

    value = false;
    expect(input.props.value()).toEqual(false);
    act(() => {
        valRef.validate();
    });
    expect(() => input.findByType(Text)).not.toThrow(); //an error message exists
});