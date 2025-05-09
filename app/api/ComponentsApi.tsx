import { IComponent } from '~/types/components';
import { ApiResponse, NovariApiManager } from 'novari-frontend-components';

const API_URL = process.env.API_URL || '';
const apiManager = new NovariApiManager({
    baseUrl: API_URL,
});

class ComponentsApi {
    static async getComponents(): Promise<ApiResponse<IComponent[]>> {
        return await apiManager.call<IComponent[]>({
            method: 'GET',
            endpoint: '/api/components',
            functionName: 'getComponents',
            customErrorMessage: 'Kunne ikke laste inn komponenter',
        });
    }

    static async addComponent(component: IComponent): Promise<ApiResponse<IComponent[]>> {
        return await apiManager.call<IComponent[]>({
            method: 'POST',
            endpoint: '/api/components',
            body: JSON.stringify(component),
            functionName: 'getComponents',
            customErrorMessage: 'Kunne ikke legge til komponenten',
            customSuccessMessage: 'Komponenten er lagt til',
        });
    }

    static async updateComponent(component: IComponent): Promise<ApiResponse<IComponent[]>> {
        return await apiManager.call<IComponent[]>({
            method: 'PUT',
            endpoint: `/api/components/${component.name}`,
            body: JSON.stringify(component),
            functionName: 'updateComponent',
            customErrorMessage: 'Kunne ikke oppdatere komponenten',
            customSuccessMessage: 'Komponenten har blitt oppdatert',
        });
    }

    static async deleteComponent(component: IComponent): Promise<ApiResponse<IComponent[]>> {
        return await apiManager.call<IComponent[]>({
            method: 'DELETE',
            endpoint: `/api/components/${component.name}`,
            body: JSON.stringify(component),
            functionName: 'updateComponent',
            customErrorMessage: 'Kunne ikke fjerne komponenten',
            customSuccessMessage: 'Komponenten har blitt fjernet',
        });
    }
}

export default ComponentsApi;
