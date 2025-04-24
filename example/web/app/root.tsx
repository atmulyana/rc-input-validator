/**
 * Example of how to use rc-input-validator package
 * https://github.com/atmulyana/rc-input-validator
 */
import React from 'react';
import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router";

import type {Route} from "./+types/root";
import {PageContext} from "./Context";
import styles from './styles';

const pageTitles = [
    'Basic',
    'Auto',
    'setMessageFunc',
    "Status Icon",
    'Compare',
    "File Upload",
];

export function Layout({children}: {children: React.ReactNode}) {
    const [pageTitle, setPageTitle] = React.useState(pageTitles[0]);

    return (
        <html lang="en" style={{height: '100%'}}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body style={styles.body}>
                <nav style={styles.tabBar}>
                {pageTitles.map(title => (
                    <a 
                        key={title}
                        href='#'
                        style={title == pageTitle ? styles.pageTabHighlight : styles.pageTab}
                        onClick={ev => {
                            ev.preventDefault();
                            if (title == pageTitle) return;
                            setPageTitle(title);
                        }}
                    >
                        {title}
                    </a>
                ))}
                </nav>

                <PageContext title={pageTitle}>
                <main style={styles.pageContent}>
                    {children}
                </main>
                </PageContext>
                
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details =
            error.status === 404
            ? "The requested page could not be found."
            : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main style={styles.errorContainer}>
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre style={styles.errorStack}>
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
