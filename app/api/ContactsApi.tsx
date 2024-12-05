import logger from '~/components/logger';
import { apiManager } from '~/api/ApiManager';
import { IContact } from '~/types/contact';
const API_URL = process.env.API_URL || '';

class ContactsApi {
    static async getContacts() {
        return await apiManager<IContact[]>({
            method: 'GET',
            url: `${API_URL}/api/contacts`,
            functionName: 'getContacts',
        });
    }

    static async addContact(contact: IContact) {
        logger.debug('Adding new contact', contact);

        const apiResluts = await apiManager<IContact[]>({
            method: 'POST',
            body: JSON.stringify(contact),
            url: `${API_URL}/api/contacts`,
            functionName: 'addContact',
        });

        if (apiResluts.status === 302) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: `kontakt allerede funnet`,
                    status: apiResluts.status,
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({
                success: apiResluts.success,
                message: apiResluts.success
                    ? 'Kontakten ble lagt til'
                    : `Kunne ikke legge til kontakt: ${apiResluts.message}`,
                variant: apiResluts.success ? 'success' : 'error',
            }),
            { status: apiResluts.status, headers: { 'Content-Type': 'application/json' } }
        );
    }

    static async updateContact(contact: IContact) {
        logger.debug('Editing contact', contact);

        const apiResluts = await apiManager<IContact[]>({
            method: 'PUT',
            body: JSON.stringify(contact),
            url: `${API_URL}/api/contacts/${contact.nin}`,
            functionName: 'updateContact',
        });

        return new Response(
            JSON.stringify({
                success: apiResluts.success,
                message: apiResluts.success
                    ? 'Kontakten er oppdatert'
                    : `Kunne ikke oppdatere kontakten: ${apiResluts.message}`,
                variant: apiResluts.success ? 'success' : 'error',
            }),
            { status: apiResluts.status, headers: { 'Content-Type': 'application/json' } }
        );
    }

    static async deleteContact(contact: IContact) {
        logger.debug('Removing contact', contact);

        const apiResluts = await apiManager<IContact[]>({
            method: 'DELETE',
            body: JSON.stringify(contact),
            url: `${API_URL}/api/contacts/${contact.nin}`,
            functionName: 'deleteContact',
        });

        return new Response(
            JSON.stringify({
                success: apiResluts.success,
                message: apiResluts.success
                    ? 'Kontakten er fjernet'
                    : `Kunne ikke fjerne kontakten: ${apiResluts.message}`,
                variant: apiResluts.success ? 'warning' : 'error',
            }),
            { status: apiResluts.status, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export default ContactsApi;
