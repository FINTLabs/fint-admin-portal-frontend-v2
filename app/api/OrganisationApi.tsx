import { IOrganisation } from '~/types/organisation';
import { ApiResponse, NovariApiManager } from 'novari-frontend-components';

const API_URL = process.env.API_URL || '';
const apiManager = new NovariApiManager({
    baseUrl: API_URL,
});
class OrganisationApi {
    static async getOrganisations(): Promise<ApiResponse<IOrganisation[]>> {
        return await apiManager.call<IOrganisation[]>({
            method: 'GET',
            endpoint: '/api/organisations',
            functionName: 'getOrganisations',
            customErrorMessage: 'Kunne ikke last inn organisasjoner',
        });
    }

    static async addOrganisation(
        organisation: IOrganisation
    ): Promise<ApiResponse<IOrganisation[]>> {
        const response = await apiManager.call<IOrganisation[]>({
            method: 'POST',
            endpoint: '/api/organisations',
            body: JSON.stringify(organisation),
            functionName: 'addOrganisation',
            customErrorMessage: 'Kunne ikke legge til organisasjonen',
            customSuccessMessage: 'Organisasjonen er lagt til',
        });

        if (response.status === 302) {
            response.message = 'Organisasjonen allerede funnet';
            response.variant = 'warning';
        }
        return response;
    }

    static async updateOrganisation(
        organisation: IOrganisation
    ): Promise<ApiResponse<IOrganisation[]>> {
        return await apiManager.call<IOrganisation[]>({
            method: 'PUT',
            endpoint: `/api/organisations/${organisation.name}`,
            functionName: 'updateOrganisation',
            body: JSON.stringify(organisation),
            customErrorMessage: 'Kunne ikke oppdatere organisasjonen',
            customSuccessMessage: 'Organisasjonen er oppdatert',
        });
    }

    static async updateLegalContact(
        organisationName: string,
        contactNin: string,
        action: 'SET' | 'REMOVE'
    ): Promise<ApiResponse<IOrganisation[]>> {
        const method = action === 'SET' ? 'PUT' : 'DELETE';

        const response = await apiManager.call<IOrganisation[]>({
            method: method,
            endpoint: `/api/organisations/${organisationName}/contacts/legal/${contactNin}`,
            functionName: 'updateLegalContact',
            customErrorMessage: `Kunne ikke ${action === 'SET' ? 'oppdatere' : 'fjerne'} Juridisk kontakt`,
            customSuccessMessage: `Juridisk kontakt er ${action === 'SET' ? 'oppdatere' : 'fjerne'}`,
        });

        if (response.status === 204) {
            response.message = `Juridisk kontakt er ${action === 'SET' ? 'oppdatere' : 'fjerne'}`;
            response.variant = 'warning';
        }
        return response;
    }

    static async deleteOrganisation(
        organisation: IOrganisation
    ): Promise<ApiResponse<IOrganisation[]>> {
        const response = await apiManager.call<IOrganisation[]>({
            method: 'DELETE',
            endpoint: '/api/contacts',
            functionName: 'deleteContact',
            body: JSON.stringify(organisation),
            customErrorMessage: 'Kunne ikke fjerne organisasjonen',
            customSuccessMessage: 'Organisasjonen er fjernet',
        });
        if (response.status === 200) {
            response.variant = 'warning';
        }
        return response;
    }
}

export default OrganisationApi;
