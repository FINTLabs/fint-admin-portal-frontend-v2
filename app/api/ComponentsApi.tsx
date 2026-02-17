import { IComponent } from '~/types/components';
import { ApiResponse, NovariApiManager } from 'novari-frontend-components';

class ComponentsApi {
    constructor(private apiManager: NovariApiManager) {}

    async getComponents(): Promise<ApiResponse<IComponent[]>> {
        return await this.apiManager.call<IComponent[]>({
            method: 'GET',
            endpoint: '/api/components',
            functionName: 'getComponents',
            customErrorMessage: 'Kunne ikke laste inn komponenter',
        });
    }

    async addComponent(component: IComponent): Promise<ApiResponse<IComponent[]>> {
        return await this.apiManager.call<IComponent[]>({
            method: 'POST',
            endpoint: '/api/components',
            body: JSON.stringify(component),
            functionName: 'getComponents',
            customErrorMessage: 'Kunne ikke legge til komponenten',
            customSuccessMessage: 'Komponenten er lagt til',
        });
    }

    async updateComponent(component: IComponent): Promise<ApiResponse<IComponent[]>> {
        return await this.apiManager.call<IComponent[]>({
            method: 'PUT',
            endpoint: `/api/components/${component.name}`,
            body: JSON.stringify(component),
            functionName: 'updateComponent',
            customErrorMessage: 'Kunne ikke oppdatere komponenten',
            customSuccessMessage: 'Komponenten har blitt oppdatert',
        });
    }

    async deleteComponent(component: IComponent): Promise<ApiResponse<IComponent[]>> {
        return await this.apiManager.call<IComponent[]>({
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
