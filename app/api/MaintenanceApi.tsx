import { ApiResponse, NovariApiManager } from 'novari-frontend-components';

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
    constructor(private apiManager: NovariApiManager) {}

    async fetchConsistency<T>(endpoint: ConsistencyEndpoint): Promise<ApiResponse<T>> {
        const url = `/api/maintenance/consistency/${endpoint}`;
        return await this.apiManager.call<T>({
            method: 'GET',
            endpoint: url,
            functionName: `fetchConsistency(${endpoint})`,
        });
    }

    async getOrganisationConsistency(): Promise<ApiResponse<ConsistencyData>> {
        return this.fetchConsistency<ConsistencyData>('components/adapters');
    }

    async getAdapterConsistency(): Promise<ApiResponse<ConsistencyData>> {
        return this.fetchConsistency<ConsistencyData>('components/adapters');
    }

    async getClientConsistency(): Promise<ApiResponse<ConsistencyData>> {
        return this.fetchConsistency<ConsistencyData>('components/clients');
    }

    async getLegalConsistency(): Promise<ApiResponse<ConsistencyData>> {
        return this.fetchConsistency<ConsistencyData>('contacts/legal');
    }

    async getTechnicalConsistency(): Promise<ApiResponse<ConsistencyData>> {
        return this.fetchConsistency<ConsistencyData>('contacts/technical');
    }
}

export default MaintenanceApi;
