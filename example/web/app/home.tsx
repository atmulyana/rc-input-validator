/**
 * Example of how to use rc-input-validator package
 * https://github.com/atmulyana/rc-input-validator
 */
import type { Route } from "./+types/home";
import {usePage} from "./Context";

import Basic from './pages/Basic';
import Auto from './pages/Auto';
import setMessageFunc from './pages/setMessageFunc';
import StatusIcon from './pages/StatusIcon';
import Compare from './pages/Compare';
import FileUpload from "./pages/FileUpload";

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

export default function Home() {
    const page = usePage();
    const Page = pages[page] || (() => <h1>Home</h1>);
    return <Page />;
}
