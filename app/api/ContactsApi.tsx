import { apiManager, ApiResponse, handleApiResponse } from '~/api/ApiManager';
import { IContact } from '~/types/contact';
import logger from '~/components/logger';
const API_URL = process.env.API_URL || '';

class ContactsApi {
    static async getContacts(): Promise<ApiResponse<IContact[]>> {
        const apiResults = await apiManager<IContact[]>({
            method: 'GET',
            url: `${API_URL}/api/contacts`,
            functionName: 'getContacts',
        });
        return handleApiResponse(apiResults, 'Kunne ikke hente kontakter');
    }

    static async addContact(contact: IContact): Promise<ApiResponse<IContact[]>> {
        logger.debug('Adding new contact', contact);

        const apiResults = await apiManager<IContact[]>({
            method: 'POST',
            body: JSON.stringify(contact),
            url: `${API_URL}/api/contacts`,
            functionName: 'addContact',
        });

        if (apiResults.status === 302) {
            return {
                success: false,
                message: 'Kontakt allerede funnet',
                variant: 'error',
            };
        }

        return handleApiResponse(
            apiResults,
            'Kunne ikke legge til kontakt',
            'Kontakten ble lagt til'
        );
    }

    static async updateContact(contact: IContact): Promise<ApiResponse<IContact[]>> {
        logger.debug('Editing contact', contact);

        const apiResults = await apiManager<IContact[]>({
            method: 'PUT',
            body: JSON.stringify(contact),
            url: `${API_URL}/api/contacts/${contact.nin}`,
            functionName: 'updateContact',
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke oppdatere kontakten',
            'Kontakten er oppdatert'
        );
    }

    static async deleteContact(contact: IContact): Promise<ApiResponse<IContact[]>> {
        logger.debug('Removing contact', contact);

        const apiResults = await apiManager<IContact[]>({
            method: 'DELETE',
            body: JSON.stringify(contact),
            url: `${API_URL}/api/contacts/${contact.nin}`,
            functionName: 'deleteContact',
        });

        return handleApiResponse(
            apiResults,
            'Kunne ikke fjerne kontakten',
            'Kontakten er fjernet',
            'warning'
        );
    }
}

export default ContactsApi;
