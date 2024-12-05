import { apiManager, ApiResponse, handleApiResponse } from '~/api/ApiManager';

const API_URL = process.env.API_URL || '';

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
        const url = `${API_URL}/api/maintenance/consistency/${endpoint}`;
        const apiResults = await apiManager({
            method: 'GET',
            url,
            functionName: `fetchConsistency(${endpoint})`,
        });

        // Cast the return type of handleApiResponse to ApiResponse<T>
        return handleApiResponse(
            apiResults,
            `Kunne ikke hente konsistens for ${endpoint}`
        ) as ApiResponse<T>;
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
