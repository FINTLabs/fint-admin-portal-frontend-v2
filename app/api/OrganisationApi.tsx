import { apiManager, ApiResponse, handleApiResponse } from './ApiManager';
import { IOrganisation } from '~/types/organisation';
import logger from '~/components/logger';

const API_URL = process.env.API_URL || '';

class OrganisationApi {
    static async getOrganisations(): Promise<ApiResponse<IOrganisation[]>> {
        const apiResults = await apiManager<IOrganisation[]>({
            method: 'GET',
            url: `${API_URL}/api/organisations`,
            functionName: 'getOrganisations',
        });
        return handleApiResponse(apiResults, 'Kunne ikke hente organisasjoner');
    }

    static async addOrganisation(
        organisation: IOrganisation
    ): Promise<ApiResponse<IOrganisation[]>> {
        logger.debug('Adding new organisation', organisation);

        const apiResults = await apiManager<IOrganisation[]>({
            method: 'POST',
            body: JSON.stringify(organisation),
            url: `${API_URL}/api/organisations`,
            functionName: 'addOrganisation',
        });

        if (apiResults.status === 302) {
            return {
                success: false,
                message: 'Organisasjonen finnes allerede',
                variant: 'error',
            };
        }

        return handleApiResponse(
            apiResults,
            'Kunne ikke legge til organisasjonen',
            'Organisasjonen ble lagt til'
        );
    }

    static async updateOrganisation(
        organisation: IOrganisation
    ): Promise<ApiResponse<IOrganisation[]>> {
        logger.debug('Editing organisation', organisation);

        const apiResults = await apiManager<IOrganisation[]>({
            method: 'PUT',
            body: JSON.stringify(organisation),
            url: `${API_URL}/api/organisations/${organisation.name}`,
            functionName: 'updateOrganisation',
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke oppdatere organisasjonen',
            'Organisasjonen er oppdatert'
        );
    }

    static async updateLegalContact(
        organisationName: string,
        contactNin: string,
        action: 'SET' | 'REMOVE'
    ): Promise<ApiResponse<IOrganisation[]>> {
        const method = action === 'SET' ? 'PUT' : 'DELETE';
        const actionText = action === 'SET' ? 'Setting' : 'Removing';
        const actionTextPast = action === 'SET' ? 'oppdatert' : 'fjernet';

        logger.debug(
            `${actionText} legal contact for organisation: ${organisationName} to: ${contactNin}`
        );

        const apiResults = await apiManager<IOrganisation[]>({
            method,
            url: `${API_URL}/api/organisations/${organisationName}/contacts/legal/${contactNin}`,
            functionName: 'updateLegalContact',
        });

        if (apiResults.status === 204) {
            return {
                success: true,
                message: `Juridisk kontakt er ${actionTextPast}`,
                variant: 'success',
            };
        }

        return handleApiResponse(
            apiResults,
            `Kunne ikke ${action === 'SET' ? 'oppdatere' : 'fjerne'} Juridisk kontakt`,
            `Juridisk kontakt er ${actionTextPast}`
        );
    }

    static async deleteOrganisation(
        organisation: IOrganisation
    ): Promise<ApiResponse<IOrganisation[]>> {
        logger.debug('Removing organisation', organisation);

        const apiResults = await apiManager<IOrganisation[]>({
            method: 'DELETE',
            body: JSON.stringify(organisation),
            url: `${API_URL}/api/organisations/${organisation.name}`,
            functionName: 'deleteOrganisation',
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke fjerne organisasjonen',
            'Organisasjonen er fjernet',
            'warning'
        );
    }
}

export default OrganisationApi;
