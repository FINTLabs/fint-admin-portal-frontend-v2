// import { type RouteConfig, index } from '@react-router/dev/routes';
//
// export default [index('routes/_index/route.tsx')] satisfies RouteConfig;

import { type RouteConfig, route } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';

export default [
    route('/', './routes/_index/route.tsx'),
    ...(await flatRoutes()),
] satisfies RouteConfig;
