/**
 * Example of how to use rc-input-validator package
 * https://github.com/atmulyana/rc-input-validator
 */
import type {CSSProperties} from "react";

const styles1 = {
    form: {
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: 1024,
    } as CSSProperties,
    pageContent: {
        flex: 1,
        overflow: 'auto',
        padding: 8,
    } as CSSProperties,
    pageTab: {
        backgroundColor: '#ccc',
        borderColor: 'gray',
        borderWidth: 1,
        boxSizing: 'border-box',
        color: 'blue',
        flex: '0 0 auto',
        fontWeight: 'bold',
        height: 26,
        margin: 4,
        padding: 2,
        paddingLeft: 4,
        paddingRight: 4,
        textDecoration: 'underline',
    } as CSSProperties,
    tabBar: {
        backgroundColor: '#aaa',
        display: 'flex',
        flex: '0 0 auto',
        flexWrap: 'wrap',
    } as CSSProperties,
    
    border: {
        borderColor: '#ccc',
        borderRadius: 4,
        borderStyle: 'solid',
        borderWidth: 1,
    } as CSSProperties,
    button: {
        fontSize: 14,
    } as CSSProperties,
    buttonContainer: {
        gap: 8,
    } as CSSProperties,
    description: {
        marginBottom: 10,
    } as CSSProperties,
    errorContainer: {
        color: 'black',
        marginInline: 'auto',
        padding: 16,
        paddingTop: 64,
        width: '100%',
    } as CSSProperties,
    errorStack: {
        overflowX: 'auto',
        padding: 16,
        width: '100%',
    } as CSSProperties,
    flex1: {
        flex: 1,
    } as CSSProperties,
    flex2: {
        flex: 2,
    } as CSSProperties,
    flex3: {
        flex: 3,
    } as CSSProperties,
    flexNone: {
        flex: 'none',
    } as CSSProperties,
    inputRow: {
        alignItems: 'flex-start',
        display: 'flex',
        flex: 'none',
        marginBottom: 10,
    } as CSSProperties,
    horizontal: {
        display: 'flex',
    } as CSSProperties,
    text: {
        fontSize: 16,
        lineHeight: '20px',
    } as CSSProperties,
    textCode: {
        fontFamily: 'monospace',
    } as CSSProperties,
    textInputHeight: {
        boxSizing: 'border-box',
        height: 30,
    } as CSSProperties,
    textPaddingHort: {
        paddingLeft: 4,
        paddingRight: 4,
    } as CSSProperties,
    textPaddingVert: {
        paddingBottom: 4,
        paddingTop: 4,
    } as CSSProperties,
    textSlim: {
        lineHeight: '16px',
        paddingBottom: 0,
        paddingTop: 0,
    } as CSSProperties,
    textSmall: {
        fontSize: 12,
        lineHeight: '15px',
    } as CSSProperties,
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        lineHeight: '24px',
        marginBottom: 10,
        textAlign: 'center'
    } as CSSProperties,
    vertical: {
        display: 'flex',
        flexDirection: 'column',
    } as CSSProperties,
};
const styles2 = {
    body: {
        ...styles1.text,
        backgroundColor: 'white',
        color: 'black',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'sans-serif',
        height: '100%',
    } as CSSProperties,
    
    label: Object.assign({}, styles1.textPaddingVert, styles1.flex1),
    name: Object.assign({display: 'flex'}, styles1.flex3) as CSSProperties,
    namePart: Object.assign({display: 'flex'}, styles1.flex1, styles1.vertical) as CSSProperties,
    pageTabHighlight: Object.assign({}, styles1.pageTab, {backgroundColor: '#eee'}),
    textBorder: Object.assign({}, styles1.border, styles1.text, styles1.textPaddingHort, styles1.textPaddingVert),
    textInput: {flex: 'none'} as CSSProperties,
};
Object.assign(styles2.textInput, styles2.textBorder, styles1.textInputHeight);

const styles = {
    ...styles1,
    ...styles2,
    buttonContainer: Object.assign(styles1.buttonContainer, styles1.flex3, styles1.horizontal),
    textInput: {
        $cover: styles1.flex3,
        $input: styles2.textInput,
    },
    textInput1: {
        $cover: styles1.flex1,
        $input: styles2.textInput,
    },
    textInputWidth(width: number, flex: 'flex1' | 'flex2' | 'flex3' = 'flex3') {
        const style = {
            $cover: styles1[flex],
            $input: {
                ...styles.textInput.$input,
                alignSelf: 'flex-start',
                width,
            },
        };
        return style;
    }
};
export default styles;