import { IContact } from '~/types/contact';
import { ApiResponse, NovariApiManager } from 'novari-frontend-components';

class ContactsApi {
    constructor(private apiManager: NovariApiManager) {}

    async getContacts(): Promise<ApiResponse<IContact[]>> {
        return await this.apiManager.call<IContact[]>({
            method: 'GET',
            endpoint: '/api/contacts',
            functionName: 'getContacts',
            customErrorMessage: 'Kunne ikke last inn kontaktdata',
        });
    }

    async addContact(contact: IContact): Promise<ApiResponse<IContact[]>> {
        const response = await this.apiManager.call<IContact[]>({
            method: 'POST',
            endpoint: '/api/contacts',
            body: JSON.stringify(contact),
            functionName: 'addContact',
            customErrorMessage: 'Kunne ikke legge til kontakten',
            customSuccessMessage: 'Kontakten ble lagt til',
        });

        if (response.status === 302) {
            response.message = 'Kontakt allerede funnet';
            response.variant = 'warning';
        }
        return response;
    }

    async updateContact(contact: IContact): Promise<ApiResponse<IContact[]>> {
        return await this.apiManager.call<IContact[]>({
            method: 'PUT',
            endpoint: '/api/contacts',
            functionName: 'updateContact',
            body: JSON.stringify(contact),
            customErrorMessage: 'Kunne ikke oppdatere kontakten',
            customSuccessMessage: 'Kontakten er oppdatert',
        });
    }

    async deleteContact(contact: IContact): Promise<ApiResponse<IContact[]>> {
        const response = await this.apiManager.call<IContact[]>({
            method: 'DELETE',
            endpoint: '/api/contacts',
            functionName: 'deleteContact',
            body: JSON.stringify(contact),
            customErrorMessage: 'Kunne ikke fjerne kontakten',
            customSuccessMessage: 'Kontakten er fjernet',
        });
        if (response.status === 200) {
            response.variant = 'warning';
        }
        return response;
    }
}

export default ContactsApi;
