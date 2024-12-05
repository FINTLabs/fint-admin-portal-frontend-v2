import logger from '~/components/logger';
import { IComponent } from '~/types/components';
import { IFetcherResponseMessage } from '~/types/FetcherResponseData';
import { apiManager } from '~/api/ApiManager';

const API_URL = process.env.API_URL || '';

class ComponentsApi {
    static async getComponents() {
        return await apiManager<IComponent[]>({
            method: 'GET',
            url: `${API_URL}/api/components`,
            functionName: 'getComponents',
        });
    }

    static async addComponent(component: IComponent) {
        logger.debug('Adding new component', component);

        const apiResults = await apiManager<IComponent[]>({
            method: 'POST',
            body: JSON.stringify(component),
            url: `${API_URL}/api/components`,
            functionName: 'addComponent',
        });

        if (apiResults.status === 302) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: `Komponenten finnes allerede`,
                    status: apiResults.status,
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({
                success: apiResults.success,
                message: apiResults.success
                    ? 'Komponenten ble lagt til'
                    : `Kunne ikke legge til komponenten: ${apiResults.message}`,
                variant: apiResults.success ? 'success' : 'error',
            }),
            { status: apiResults.status, headers: { 'Content-Type': 'application/json' } }
        );
    }

    static async updateComponent(component: IComponent) {
        logger.debug('Editing component', component);

        const apiResults = await apiManager<IFetcherResponseMessage[]>({
            method: 'PUT',
            body: JSON.stringify(component),
            url: `${API_URL}/api/components/${component.name}`,
            functionName: 'updateComponent',
        });

        return new Response(
            JSON.stringify({
                success: apiResults.success,
                message: apiResults.success
                    ? 'Komponenten har blitt oppdatert'
                    : `Kunne ikke oppdatere komponenten: ${apiResults.message}`,
                variant: apiResults.success ? 'success' : 'error',
            }),
            { status: apiResults.status, headers: { 'Content-Type': 'application/json' } }
        );
    }

    static async deleteComponent(component: IComponent) {
        logger.debug('Removing component', component);

        const apiResults = await apiManager<IFetcherResponseMessage[]>({
            method: 'DELETE',
            body: JSON.stringify(component),
            url: `${API_URL}/api/components/${component.name}`,
            functionName: 'deleteComponent',
        });

        return new Response(
            JSON.stringify({
                success: apiResults.success,
                message: apiResults.success
                    ? 'Komponenten har blitt fjernet'
                    : `Kunne ikke fjerne komponenten: ${apiResults.message}`,
                variant: apiResults.success ? 'warning' : 'error',
            }),
            { status: apiResults.status, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export default ComponentsApi;
