/**
 * Example of how to use rc-input-validator package
 * https://github.com/atmulyana/rc-input-validator
 */
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("home.tsx"),
    route('bootstrap', 'home-bootstrap.tsx'),
] satisfies RouteConfig;
