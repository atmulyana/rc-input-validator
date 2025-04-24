/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {act, cleanup, render, screen} from '@testing-library/react-native'; //cannot use "@testing-library/react", needs `ReactTestInstance` 
import {Validation} from "../../web/Validation";
import {rule} from '../../rules';

let valRef;
const Form = ({value}) =>
    <main>
        <Validation ref={ref => valRef = ref}
            rules={rule(val => !!val)}
            testID="validation"
            value={value} />
    </main>;

afterEach(cleanup);

test('render Value with actual value', async () => {
    render(<Form value={false} />);
    
    //expect(screen.toJSON()).toMatchSnapshot();

    const form = screen.root;
    const input = form.findByType(Validation);
    expect(input.props.value).toEqual(false);
    expect(() => input.findByProps({role: 'error-message'})).toThrow(); //no error message
    
    act(() => {
        valRef.validate();
    });
    expect(() => input.findByProps({role: 'error-message'})).not.toThrow(); //an error message exists
});

test('render Value with value as a function', () => {
    let value = true;
    render(<Form value={() => value} />);
    
    //expect(screen.toJSON()).toMatchSnapshot();

    const form = screen.root;
    const input = form.findByType(Validation);
    expect(typeof(input.props.value)).toEqual('function');
    expect(() => input.findByProps({role: 'error-message'})).toThrow(); //no error message
    
    expect(input.props.value()).toEqual(true);
    act(() => {
        valRef.validate();
    });
    expect(() => input.findByProps({role: 'error-message'})).toThrow(); //no error message

    value = false;
    expect(input.props.value()).toEqual(false);
    act(() => {
        valRef.validate();
    });
    expect(() => input.findByProps({role: 'error-message'})).not.toThrow(); //an error message exists
});