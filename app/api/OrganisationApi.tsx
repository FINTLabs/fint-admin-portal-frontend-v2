import { apiManager } from './ApiManager';
import { IOrganisation } from '~/types/organisation';
import logger from '~/components/logger';
import { IFetcherResponseMessage } from '~/types/FetcherResponseData';

const API_URL = process.env.API_URL || '';

class OrganisationApi {
    static async getOrganisations() {
        return await apiManager<IOrganisation[]>({
            method: 'GET',
            url: `${API_URL}/api/organisations`,
            functionName: 'getOrganisations',
        });
    }

    static async addOrganisation(organisation: IOrganisation) {
        logger.debug('Adding new organisation', organisation);

        const apiResluts = await apiManager<IFetcherResponseMessage[]>({
            method: 'POST',
            body: JSON.stringify(organisation),
            url: `${API_URL}/api/organisations`,
            functionName: 'addOrganisation',
        });

        if (apiResluts.status === 302) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: `organisation allerede funnet`,
                    status: apiResluts.status,
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({
                success: apiResluts.success,
                message: apiResluts.success
                    ? 'Organisasjonen ble lagt til'
                    : `Kunne ikke legge til organisasjonen: ${apiResluts.message}`,
                variant: apiResluts.success ? 'success' : 'error',
            }),
            { status: apiResluts.status, headers: { 'Content-Type': 'application/json' } }
        );
    }

    static async updateOrganisation(organisation: IOrganisation) {
        logger.debug('Editing organisation', organisation);

        const apiResluts = await apiManager<IFetcherResponseMessage[]>({
            method: 'PUT',
            body: JSON.stringify(organisation),
            url: `${API_URL}/api/organisations/${organisation.name}`,
            functionName: 'updateOrganisation',
        });

        return new Response(
            JSON.stringify({
                success: apiResluts.success,
                message: apiResluts.success
                    ? 'Organisasjonen er oppdatert'
                    : `Kunne ikke oppdatere organisasjonen: ${apiResluts.message}`,
                variant: apiResluts.success ? 'success' : 'error',
            }),
            { status: apiResluts.status, headers: { 'Content-Type': 'application/json' } }
        );
    }

    static async updateLegalContact(
        organisationName: string,
        contactNin: string,
        action: 'SET' | 'REMOVE'
    ) {
        const method = action === 'SET' ? 'PUT' : 'DELETE';
        const actionText = action === 'SET' ? 'Setting' : 'Removing';
        const actionTextPast = action === 'SET' ? 'oppdatert' : 'fjernet';

        logger.debug(
            `${actionText} legal contact for organisation: ${organisationName} to: ${contactNin}`
        );

        const apiResluts = await apiManager<IFetcherResponseMessage[]>({
            method,
            url: `${API_URL}/api/organisations/${organisationName}/contacts/legal/${contactNin}`,
            functionName: 'updateLegalContact',
        });

        if (apiResluts.status === 204) {
            return new Response(
                JSON.stringify({
                    success: true,
                    message: `Juridisk kontakt er ${actionTextPast}`,
                    status: apiResluts.status,
                }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        } else {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: `Kunne ikke ${action === 'SET' ? 'oppdatere' : 'fjerne'} Juridisk kontakt: ${apiResluts.message}`,
                    status: apiResluts.status,
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }

    static async deleteOrganisation(organisation: IOrganisation) {
        logger.debug('Removing organisation', organisation);

        const apiResluts = await apiManager<IFetcherResponseMessage[]>({
            method: 'DELETE',
            body: JSON.stringify(organisation),
            url: `${API_URL}/api/organisations/${organisation.name}`,
            functionName: 'deleteOrganisation',
        });

        return new Response(
            JSON.stringify({
                success: apiResluts.success,
                message: apiResluts.success
                    ? 'Organisasjonen er fjernet'
                    : `Kunne ikke fjernet organisasjonen: ${apiResluts.message}`,
                variant: apiResluts.success ? 'success' : 'error',
            }),
            { status: apiResluts.status, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export default OrganisationApi;
