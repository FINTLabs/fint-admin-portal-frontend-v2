import { ApiResponse, NovariApiManager } from 'novari-frontend-components';

const API_URL = process.env.API_URL || '';
const apiManager = new NovariApiManager({
    baseUrl: API_URL,
});

type ConsistencyEndpoint =
    | 'components/adapters'
    | 'components/clients'
    | 'contacts/legal'
    | 'contacts/technical';

interface ConsistencyData {
    id: string;
    name: string;
    status: string;
    details?: string;
    // Add other relevant properties based on your API response structure
}

class MaintenanceApi {
    static async fetchConsistency<T>(endpoint: ConsistencyEndpoint): Promise<ApiResponse<T>> {
        const url = `/api/maintenance/consistency/${endpoint}`;
        return await apiManager.call<T>({
            method: 'GET',
            endpoint: url,
            functionName: `fetchConsistency(${endpoint})`,
        });
    }

    static async getOrganisationConsistency(): Promise<ApiResponse<ConsistencyData>> {
        return MaintenanceApi.fetchConsistency<ConsistencyData>('components/adapters');
    }

    static async getAdapterConsistency(): Promise<ApiResponse<ConsistencyData>> {
        return MaintenanceApi.fetchConsistency<ConsistencyData>('components/adapters');
    }

    static async getClientConsistency(): Promise<ApiResponse<ConsistencyData>> {
        return MaintenanceApi.fetchConsistency<ConsistencyData>('components/clients');
    }

    static async getLegalConsistency(): Promise<ApiResponse<ConsistencyData>> {
        return MaintenanceApi.fetchConsistency<ConsistencyData>('contacts/legal');
    }

    static async getTechnicalConsistency(): Promise<ApiResponse<ConsistencyData>> {
        return MaintenanceApi.fetchConsistency<ConsistencyData>('contacts/technical');
    }
}

export default MaintenanceApi;
