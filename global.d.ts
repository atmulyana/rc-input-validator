/**
 * https://github.com/atmulyana/rc-input-validator
 */
type Nullable<T> = T | null | undefined;

declare namespace React {
    type Config<Props, DefaultProps> = {
        [p in keyof DefaultProps]?: DefaultProps[p];
    } & {
        [p in keyof Props as (p extends keyof DefaultProps ? never : p)]: Props[p];
    }

    type AbstractComponent<Props, Ref> = React.ComponentType<Props & React.RefAttributes<Ref>>;
}