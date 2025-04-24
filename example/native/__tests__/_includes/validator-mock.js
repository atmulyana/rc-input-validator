/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {
    setRef as mock_setRef,
    str as mock_str,
} from '../../../../';
import {
    red as mock_red,
} from '../../../../Context';
import {
    Validation as mock_Validation,
    ValidationContext as mock_ValidationContext,
    isDifferentStyle as mock_isDifferentStyle,
    withValidation as mock_withValidation,
} from '../../../../native';
import mock_ValidationRule, {
    CustomRule as mock_CustomRule,
    rule as mock_rule,
    Email as mock_Email,
    email as mock_email,
    Integer as mock_Integer,
    integer as mock_integer,
    Max as mock_Max,
    max as mock_max,
    Min as mock_Min,
    min as mock_min,
    Numeric as mock_Numeric,
    numeric as mock_numeric,
    Regex as mock_Regex,
    regex as mock_regex,
    Required as mock_Required,
    required as mock_required,
    Length as mock_Length,
    length as mock_length,
} from '../../../../rules';

jest.mock('rc-input-validator', 
    () => ({
        __esModule: true,
        setRef: mock_setRef,
        str: mock_str,
    }),
    {virtual: true}
);

jest.mock('rc-input-validator/Context', 
    () => ({
        __esModule: true,
        red: mock_red,
    }),
    {virtual: true}
);

jest.mock('rc-input-validator/native', 
    () => ({
        __esModule: true,
        Validation: mock_Validation,
        ValidationContext: mock_ValidationContext,
        isDifferentStyle: mock_isDifferentStyle,
        withValidation: mock_withValidation,
    }),
    {virtual: true}
);

jest.mock('rc-input-validator/rules',
    () => ({
        __esModule: true,
        default: mock_ValidationRule,
        CustomRule: mock_CustomRule,
        rule: mock_rule,
        Email: mock_Email,
        email: mock_email,
        Integer: mock_Integer,
        integer: mock_integer,
        Max: mock_Max,
        max: mock_max,
        Min: mock_Min,
        min: mock_min,
        Numeric: mock_Numeric,
        numeric: mock_numeric,
        Regex: mock_Regex,
        regex: mock_regex,
        Required: mock_Required,
        required: mock_required,
        Length: mock_Length,
        length: mock_length,
    }),
    {virtual: true}
);