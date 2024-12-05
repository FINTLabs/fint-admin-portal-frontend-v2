import logger from '~/components/logger';
import { IComponent } from '~/types/components';
import { apiManager, ApiResponse, handleApiResponse } from '~/api/ApiManager';

const API_URL = process.env.API_URL || '';

class ComponentsApi {
    static async getComponents(): Promise<ApiResponse<IComponent[]>> {
        const apiResults = await apiManager<IComponent[]>({
            method: 'GET',
            url: `${API_URL}/api/components`,
            functionName: 'getComponents',
        });
        return handleApiResponse(apiResults, 'Kunne ikke hente komponenter');
    }

    static async addComponent(component: IComponent): Promise<ApiResponse<IComponent[]>> {
        logger.debug('Adding new component', component);

        const apiResults = await apiManager<IComponent[]>({
            method: 'POST',
            body: JSON.stringify(component),
            url: `${API_URL}/api/components`,
            functionName: 'addComponent',
        });

        if (apiResults.status === 302) {
            return {
                success: false,
                message: 'Komponenten finnes allerede',
                variant: 'error',
            };
        }

        return handleApiResponse(
            apiResults,
            'Kunne ikke legge til komponenten',
            'Komponenten ble lagt til'
        );
    }

    static async updateComponent(component: IComponent): Promise<ApiResponse<IComponent[]>> {
        logger.debug('Editing component', component);

        const apiResults = await apiManager<IComponent[]>({
            method: 'PUT',
            body: JSON.stringify(component),
            url: `${API_URL}/api/components/${component.name}`,
            functionName: 'updateComponent',
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke oppdatere komponenten',
            'Komponenten har blitt oppdatert'
        );
    }

    static async deleteComponent(component: IComponent): Promise<ApiResponse<IComponent[]>> {
        logger.debug('Removing component', component);

        const apiResults = await apiManager<IComponent[]>({
            method: 'DELETE',
            body: JSON.stringify(component),
            url: `${API_URL}/api/components/${component.name}`,
            functionName: 'deleteComponent',
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke fjerne komponenten',
            'Komponenten har blitt fjernet',
            'warning'
        );
    }
}

export default ComponentsApi;
