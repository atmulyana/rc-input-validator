/**
 * https://github.com/atmulyana/rc-input-validator
 */
import * as React from 'react';
import {
    /*isForwardRef*/ ForwardRef,
    isValidElementType,
} from 'react-is';
import {
    emptyString,
    noop,
} from "javascript-common";
import {extRefCallback} from 'reactjs-common';
import type {
    ContextValue,
    ValidationOption,
    ValidationProps,
} from './types';
import type {
    InputRef,
    LangFunction,
} from "./types";
import {AsyncFailMessage} from './types';
import {ValidationRuleAsync} from './rules';
import {useState, validate, validateAsync} from './helpers';
import messages from './messages';

export type HocInput<Props, Instance> = React.AbstractComponent<Props, Instance & InputRef>;

export function validationFactory<
    StyleProp,
    Style extends StyleProp = StyleProp,
    CompositeStyleProp = StyleProp,
    ExcludedPropNames extends string = ''
>(
    getDefaultValues: <PProps, POuterProps extends Omit<PProps, ExcludedPropNames>, Value>() => {
        Context: React.Context<ContextValue<StyleProp>>,
        getStyle: NonNullable<ValidationOption<PProps, StyleProp, POuterProps, CompositeStyleProp>['getStyle']>,
        getValue: NonNullable<ValidationOption<PProps, StyleProp, POuterProps, CompositeStyleProp, Value>['getValue']>,
        setStyle: NonNullable<ValidationOption<PProps, StyleProp, POuterProps, CompositeStyleProp>['setStyle']>,
        isDifferentStyle: (style1: CompositeStyleProp | undefined, style2: CompositeStyleProp | undefined) => boolean,
        prepareStyle: (s: CompositeStyleProp) => {input?: Style, container?: Style},
    }
) { 
    function withValidation<
        Props,
        OuterProps extends Omit<Props, ExcludedPropNames> = Props,
        Instance = unknown,
        Value = unknown,
    >(
        Input: React.AbstractComponent<Props, Instance>,
        option: ValidationOption<Props, StyleProp, OuterProps, CompositeStyleProp, Value>
    ): HocInput<OuterProps, Instance & InputRef> {
        type Opt = ValidationOption<Props, StyleProp, OuterProps, CompositeStyleProp, Value>;

        let {Context, getStyle, getValue, setStyle, isDifferentStyle, prepareStyle} = getDefaultValues<Props, OuterProps, Value>();
        ({getStyle = getStyle, getValue = getValue, setStyle = setStyle} = option);
        let asyncFailMessage: Opt['asyncFailMessage'] = option.asyncFailMessage,
            errorTextStyle: Opt['errorTextStyle'] = option.errorTextStyle,
            inputErrorStyle: Opt['inputErrorStyle'] = option.inputErrorStyle,
            lang: LangFunction | undefined = option.lang,
            setStatusStyle: Opt['setStatusStyle'] = option.setStatusStyle ?? ((props, style, context) => {
                if (style) {
                    const newStyle = [context.normalStyle, ...style];
                    setStyle(props, newStyle);
                }
                else if (style !== false) { //`false` means re-rendering => the style has been reverted to normal by `setStyle`
                    setStyle(props, context.normalStyle);
                }
                return null;
            });
    
            

        const isAsync = Array.isArray(option.rules)
            ? option.rules.some(rule => rule instanceof ValidationRuleAsync)
            : (option.rules instanceof ValidationRuleAsync);
        
        let InputHasRef: React.AbstractComponent<Props, Instance>;
        if (typeof Input == 'function' && Input.prototype.isReactComponent) InputHasRef = Input;
        else if (/*isForwardRef(Input)*/ (Input as any)?.$$typeof === ForwardRef) InputHasRef = Input;
        else {
            /* It's just a trick to make `Input` (that is a function component)
            can accept `ref` property without an error/warning message */
            //@ts-ignore
            InputHasRef = class extends React.Component<Props> {
                render(): React.ReactNode {
                    return isValidElementType(Input) //we still prepare that `withValidation` is called without type-checking
                        && <Input {...this.props} />;
                }
            };
        }

        
        class Validator {
            constructor() {
                if (typeof setStatusStyle == 'function') {
                    this.styleContext.clearValidation = () => {this.needsToClear = true};
                    const This = this;
                    Object.defineProperty(this.styleContext, 'normalStyle', {
                        get() {
                            return This.styles.input;
                        }
                    });
                    this.setStatStyle = setStatusStyle.bind(this.styleContext);
                    this.setStatusStyle = function(this: Validator, isError: boolean, isClear?: Nullable<boolean>) {
                        const mark = this.setStatStyle(
                            this.props,
                            
                            isError ? this.inputErrorStyle :
                            isClear ? void(0) : /** to tell that it's the clearance of validation status, `setStatusStyle` shouldn't give the input a 'success' style */ 
                                      null,     /** the input is valid, `setStatusStyle` may give the input a 'success' style such as a green border */
                            
                            this.styleContext
                        );
                        this.seValidationMark(isClear ? null : mark); //`mark` can be an icon of validation status
                    }
                }

                this.ValidatedInput = this.ValidatedInput.bind(this);
            }
            
            currentStyle?: CompositeStyleProp;
            inputErrorStyle: [StyleProp | undefined, StyleProp | undefined] = [undefined, inputErrorStyle];
            isValid: boolean = true;
            needsToClear: boolean = false;
            props!: Props;
            styles: ReturnType<ReturnType<typeof getDefaultValues>['prepareStyle']> = {};
            styleContext: {
                clearValidation: () => void,
                flag: any,
                readonly normalStyle?: StyleProp,
            } = {
                clearValidation: noop,
                flag: 0,
            };
            
            validate = (): string => {
                const value = getValue(this.props);
                const error = validate(
                    value,
                    option.rules,
                    option.name,
                    _ctx.lang ?? lang
                );
                if (typeof error == "string") {
                    return error.trim();
                }
                return emptyString;
            };

            validateAsync = async (): Promise<string> => {
                const value = getValue(this.props);
                try {
                    const error = await validateAsync(
                        value,
                        option.rules,
                        option.name,
                        _ctx.lang ?? lang,
                    );
                    if (typeof error == "string") {
                        return error.trim();
                    }
                } catch (err) {
                    if ( (asyncFailMessage ?? _ctx.asyncFailMessage) == AsyncFailMessage.CaughtError ) {
                        let message = emptyString;
                        if (err instanceof Error) message = err.message;
                        else if (typeof err == "string") message = err;
                        message = message && message.trim();
                        if (message) return message;
                    }
                    return messages.asyncFail;
                }
                return emptyString;
            };

            getErrorMessage = (): string => emptyString;
            setErrorMessage: (err: string) => unknown = noop;
            setStatusStyle: Nullable<((isValid: boolean, isClear?: Nullable<boolean>) => unknown)>;
            setStatStyle: NonNullable<Opt['setStatusStyle']> = noop;
            seValidationMark: (mark: React.ReactNode) => unknown = noop;

            setMessage(error: string, isClear?: boolean): boolean {
                this.setErrorMessage(error);
                this.isValid = !error;
                typeof(this.setStatusStyle) == 'function' && this.setStatusStyle(!this.isValid, isClear);
                return this.isValid;
            }

            ValidatedInput: (p: {inputRef: React.Ref<Instance>}) => React.ReactNode = ({inputRef}) => {
                const [errorMessage, setErrorMessage] = React.useState<string>(emptyString);
                this.getErrorMessage = () => errorMessage;
                this.setErrorMessage = function(err: string) {
                    setErrorMessage(err);
                }
        
                const [validationMark, setValidationMark] = React.useState<Nullable<{node: React.ReactNode}>>(null);
                this.seValidationMark = function(mark: React.ReactNode) {
                    setValidationMark({node: mark}); /*always creating new object is in order for the state is always updated so that
                                                       the new error style is always applied in the case the `mark` is always null/undefined*/
                }
                
                const Container = option.Container ?? _ctx.Container;
                const ErrorText = option.ErrorText ?? _ctx.ErrorText;
                const props = this.props as React.PropsWithoutRef<Props>;
                return <Container style={this.styles.container}>
                    <InputHasRef {...props} ref={inputRef} />
                    {validationMark?.node}
                    {!!errorMessage && <ErrorText style={[_ctx.errorTextStyle, errorTextStyle]}>{errorMessage}</ErrorText>}
                </Container>;
            }
        }

        function createInputRef(validator: Validator): InputRef & {$$proxy$$: Nullable<InputRef>, [p: string]: any} {
            let _index = -1;
            const inpRef: InputRef & {$$proxy$$: Nullable<InputRef>, [p: string]: any} = {
                $$proxy$$: null,
                get index() {
                    if (_index < 0) _index = _ctx.nextIndex;
                    return _index;
                },
                get isValid() {return validator.isValid},
                get name() {return option.name},
            
                clearValidation() {
                    validator.setMessage(emptyString, true);
                },

                getErrorMessage(): string {
                    return validator.getErrorMessage();
                },

                setErrorMessage(message: string) {
                    validator.setMessage(message.trim());
                },
            
                validate(): boolean {
                    const error = validator.validate();
                    return validator.setMessage(error);
                },

                async validateAsync(): Promise<boolean> {
                    const error = await validator.validateAsync();
                    return validator.setMessage(error);
                },
            };
            
            if (
                _index < 0 //Unnecessary because `createInputRef` is only invoked only once for an input but it make sure that this block is really executed only once
                &&
                inpRef.index >= 0 //The input is rendered inside a Context
            ) {
                //Reserves a slot in the input list of the context. If we register the input after it's mounted, the order of inputs may not precise
                //because there may be an input needs longer time to mount
                _ctx.addRef(inpRef);
                _ctx.removeRef(inpRef);
            }

            return inpRef;
        }

        
        let _ctx: ContextValue<StyleProp>;
        //need auto validation?
        const isAuto: Nullable<boolean> = isAsync ? false :         //asynchronous validation cannot apply auto validation 
              option.auto !== undefined           ? !!option.auto : //if `auto` is defined in `option` then use it
              null;                                                 //default to context option configuration

        function forwardRef(props: React.PropsWithoutRef<OuterProps>, ref: React.Ref<Instance & InputRef>) {
            _ctx = React.useContext(Context);
            
            const validator = useState(() => new Validator());
            validator.props = {...validator.props, ...props};
            if (validator.inputErrorStyle[0] !== _ctx.inputErrorStyle) validator.inputErrorStyle = [_ctx.inputErrorStyle, inputErrorStyle];
            const validationRef = useState(() => createInputRef(validator));

            let style = getStyle(props as OuterProps); //NOT `validator.props`; `props` may not have style property and `validator.props` should have one from previous rendering
            if (isDifferentStyle(style, validator.currentStyle)) {
                validator.styles = prepareStyle(style);
                validator.currentStyle = style;
            }
    
            setStyle(
                validator.props,
                validator.styles.input,
                {
                    get style() {
                        return validator.styles.container;
                    },
                    set style(value) {
                        validator.styles.container = value;
                    },
                }
                
            );
            validator.setStatStyle(
                validator.props,
                validator.isValid ? false : validator.inputErrorStyle,
                validator.styleContext
            );

            const value = getValue(validator.props);
            React.useEffect(() => {
                if (isAuto ?? _ctx.auto)
                    validationRef.validate();
                else if (!validator.isValid || validator.needsToClear) {
                    validator.needsToClear = false;
                    validationRef.clearValidation(); //don't worry about the validity of input's value because it should be re-validated when re-submitted
                }
            }, [value]);
            
            const refCallback = React.useCallback(
                extRefCallback<Instance, InputRef>(
                    ref,
                    validationRef,
                    (inpRef: Instance & InputRef) => {
                        if (inpRef) {
                            _ctx.addRef(inpRef);
                            validationRef.$$proxy$$ = inpRef;
                        }
                        else if (validationRef.$$proxy$$) {
                            _ctx.removeRef(validationRef.$$proxy$$);
                            validationRef.$$proxy$$ = null;
                        }
                    }
                ),
                [ref]
            );
            
            return <validator.ValidatedInput inputRef={refCallback} />;
        };
        forwardRef.displayName = `withValidation<${(Input?.displayName || Input?.name || 'Input')}>`;
        return React.forwardRef(forwardRef);
    }


    type EmptyComponentProps = {
        style?: CompositeStyleProp,
        value: unknown,
    };
    function EmptyComponent(props: EmptyComponentProps): React.ReactNode {
        return null;
    }
    class Validation extends React.Component<ValidationProps<StyleProp, CompositeStyleProp>> implements InputRef {
        #component: React.AbstractComponent<EmptyComponentProps, InputRef>;
        #compRef: React.RefObject<InputRef | null> = React.createRef<InputRef>();

        constructor(props: ValidationProps<StyleProp, CompositeStyleProp>) {
            super(props);
            this.#component = withValidation(EmptyComponent, {
                auto: props.auto,
                Container: props.Container,
                ErrorText: props.ErrorText,
                errorTextStyle: props.errorTextStyle,
                getValue: function(props) {
                    let value = props.value;
                    if (typeof(value) == 'function') return value();
                    return value;
                },
                lang: props.lang,
                rules: props.rules,
            });
        }

        get index(): number {return -1}

        get isValid(): boolean {
            return this.#compRef.current?.isValid ?? true;
        }
        
        clearValidation() {
            this.#compRef.current?.clearValidation();
        }
            
        validate(): boolean {
            return this.#compRef.current?.validate() ?? true;
        }

        async validateAsync(): Promise<boolean> {
            const compRef = this.#compRef.current;
            if (compRef) {
                return await compRef.validateAsync();
            }
            return true;
        }

        getErrorMessage(): string {
            return this.#compRef.current?.getErrorMessage() ?? emptyString;
        }

        setErrorMessage(message: string) {
            this.#compRef.current?.setErrorMessage(message);
        }

        shouldComponentUpdate(nextProps: ValidationProps<StyleProp, CompositeStyleProp>): boolean {
            //The other properties are write-once (only set when this component is initialized)
            return this.props.value !== nextProps.value || this.props.style !== nextProps.style;
        }

        render(): React.ReactElement<React.AbstractComponent<EmptyComponentProps, InputRef>> {
            const Component = this.#component;
            const {style, value} = this.props;
            return <Component ref={this.#compRef} style={style} value={value} />;
        }
    }

    return {withValidation, Validation};
}