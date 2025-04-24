/**
 * Example of how to use rc-input-validator package
 * https://github.com/atmulyana/rc-input-validator
 */
import React from 'react';

const Context = React.createContext('');

export function PageContext({
    children,
    title,
}: {
    children: React.ReactNode,
    title: string,
}) {
    return <Context.Provider value={title}>
        {children}
    </Context.Provider>;
}

export function usePage() {
    return React.useContext(Context);
}