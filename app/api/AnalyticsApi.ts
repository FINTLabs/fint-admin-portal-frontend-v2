import { NovariApiManager } from 'novari-frontend-components';

const apiManager = new NovariApiManager({
    baseUrl: '',
});
let APP_NAME = 'admin-portal';
let TENANT = 'novari.no';

class AnalyticsApi {
    static async trackEvent(params: {
        type: 'page_view' | 'button_click' | 'search' | 'error';
        path?: string;
        element?: string;
        // tenant?: string;
        meta?: any;
    }) {
        const body = {
            app: APP_NAME,
            type: params.type,
            path: params.path ?? null,
            element: params.element ?? null,
            tenant: TENANT,
            meta: params.meta ?? null,
        };

        const res = await apiManager.call({
            method: 'POST',
            endpoint: `/_analytics/events`,
            functionName: 'trackEvent',
            body,
            additionalHeaders: {
                'x-analytics-token': 'change-me',
            },
        });
        // console.log('trackEvent', res);
        return res;
    }

    static async trackButtonClick(element: string, path: string) {
        return this.trackEvent({
            type: 'button_click',
            path,
            element,
        });
    }

    static async trackSearch(path: string, meta: Record<string, unknown>) {
        return this.trackEvent({
            type: 'search',
            path,
            meta,
        });
    }

    static async trackError(params: { path: string; message: string; statusCode?: number }) {
        return this.trackEvent({
            type: 'error',
            path: params.path,
            meta: {
                message: params.message,
                statusCode: params.statusCode ?? null,
            },
        });
    }
}
export default AnalyticsApi;
