import { apiManager } from '~/api/ApiManager';

const API_URL = process.env.API_URL || '';

type ConsistencyEndpoint =
    | 'components/adapters'
    | 'components/clients'
    | 'contacts/legal'
    | 'contacts/technical';

class MaintenanceApi {
    static async fetchConsistency(endpoint: ConsistencyEndpoint) {
        const url = `${API_URL}/api/maintenance/consistency/${endpoint}`;
        return await apiManager({
            method: 'GET',
            url,
            functionName: `fetchConsistency(${endpoint})`,
        });
    }

    static getOrganisationConsistency() {
        return MaintenanceApi.fetchConsistency('components/adapters');
    }

    static getAdapterConsistency() {
        return MaintenanceApi.fetchConsistency('components/adapters');
    }

    static getClientConsistency() {
        return MaintenanceApi.fetchConsistency('components/clients');
    }

    static getLegalConsistency() {
        return MaintenanceApi.fetchConsistency('contacts/legal');
    }

    static getTechnicalConsistency() {
        return MaintenanceApi.fetchConsistency('contacts/technical');
    }
}

export default MaintenanceApi;
