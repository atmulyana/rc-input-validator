/**
 * https://github.com/atmulyana/rc-input-validator
 */

import 'react-native';
import React from 'react';
import './_includes/rn-mock';
import './_includes/validator-mock';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.act(() =>{
    renderer.create(<App />);
  });
});
