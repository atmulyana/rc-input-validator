/**
 * https://github.com/atmulyana/rc-input-validator
 */
import {getStyleProps} from '../../web/helpers';

test('getStyleProps: single parameter', () => {
    let props = getStyleProps(undefined);
    expect(props.className).toBeUndefined();
    expect('className' in props).toBe(true);
    expect(props.style).toBeUndefined();
    expect('style' in props).toBe(true);
    
    props = getStyleProps(null);
    expect(props.className).toBeUndefined();
    expect('className' in props).toBe(true);
    expect(props.style).toBeUndefined();
    expect('style' in props).toBe(true);
    
    props = getStyleProps('title');
    expect(props.className).toBe('title');
    expect(props.style).toBeUndefined();
    expect('style' in props).toBe(true);
    
    props = getStyleProps({backgroundColor: 'white', color: 'black'});
    expect(props.className).toBeUndefined();
    expect('className' in props).toBe(true);
    expect(props.style).toEqual({backgroundColor: 'white', color: 'black'});

    props = getStyleProps({
        $class: 'title',
        $style: {backgroundColor: 'white', color: 'black'},
    });
    expect(props.className).toBe('title');
    expect(props.style).toEqual({backgroundColor: 'white', color: 'black'});
});

test('getStyleProps: multiple/array parameter', () => {
    let props = getStyleProps(['title', 'highlight']);
    expect(props.className).toBe('title highlight');
    expect(props.style).toBeUndefined();
    expect('style' in props).toBe(true);
    
    props = getStyleProps('title', 'highlight');
    expect(props.className).toBe('title highlight');
    expect(props.style).toBeUndefined();
    expect('style' in props).toBe(true);

    props = getStyleProps( [ {backgroundColor: 'white', color: 'black'}, {color: 'green'} ] );
    expect(props.className).toBeUndefined();
    expect('className' in props).toBe(true);
    expect(props.style).toEqual({backgroundColor: 'white', color: 'green'});

    props = getStyleProps( {backgroundColor: 'white', color: 'black'}, {color: 'green'} );
    expect(props.className).toBeUndefined();
    expect('className' in props).toBe(true);
    expect(props.style).toEqual({backgroundColor: 'white', color: 'green'});
    
    props = getStyleProps([
        'title',
        undefined,
        {backgroundColor: 'white', color: 'black'},
        null,
        'highlight',
        {color: 'green'},
        {
            $class: 'bolder',
            $style: {fontStyle: 'italic'},
        }
    ]);
    expect(props.className).toBe('title highlight bolder');
    expect(props.style).toEqual({backgroundColor: 'white', color: 'green', fontStyle: 'italic'});
    
    props = getStyleProps(
        'title',
        undefined,
        {backgroundColor: 'white', color: 'black'},
        null,
        'highlight',
        {color: 'green'},
        {
            $class: 'bolder',
            $style: {fontStyle: 'italic'},
        }
    );
    expect(props.className).toBe('title highlight bolder');
    expect(props.style).toEqual({backgroundColor: 'white', color: 'green', fontStyle: 'italic'});
});