/**
 * Example of how to use rc-input-validator package
 * https://github.com/atmulyana/rc-input-validator
 */
import type {Route} from "./+types/home";
import {usePage} from "./Context";

import Basic from './bootstrap-pages/Basic';
import Auto from './bootstrap-pages/Auto';
import setMessageFunc from './bootstrap-pages/setMessageFunc';
import StatusIcon from './bootstrap-pages/StatusIcon';
import Compare from './bootstrap-pages/Compare';
import FileUpload from "./bootstrap-pages/FileUpload";

const pages: {[p: string]: React.ComponentType<any>} = {
    Basic,
    Auto,
    setMessageFunc,
    "Status Icon": StatusIcon,
    Compare,
    "File Upload": FileUpload,
};

export function meta({}: Route.MetaArgs) {
    return [
        { title: "rc-input-validator Demo" },
        { name: "description", content: "You may test rc-input-validator here!" },
    ];
}

export const links = () => [
    {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css",
    },
];

export default function Home() {
    const page = usePage();
    const Page = pages[page] || (() => <h1>Home</h1>);
    return <Page />;
}
