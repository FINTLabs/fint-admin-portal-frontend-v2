import { type RouteConfig, route } from '@react-router/dev/routes';

export default [
    route('/', './routes/_index/route.tsx'),
    route('/contact', './routes/contact/route.tsx'),
    route('/organisation', './routes/organisation/route.tsx'),
    route('/component', './routes/component/route.tsx'),
    route('/tools', './routes/tools/route.tsx'),
    route('/_analytics/events', './routes/api.events.tsx'),
    route('/metrics', './routes/metrics/route.tsx'),
] satisfies RouteConfig;
