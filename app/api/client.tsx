import { NovariApiManager } from 'novari-frontend-components';
import ComponentsApi from './ComponentsApi';
import ContactsApi from './ContactsApi';
import MaintenanceApi from './MaintenanceApi';
import MeApi from './MeApi';
import OrganisationApi from './OrganisationApi';

const API_URL = process.env.API_URL || '';

export const getApiClient = (request: Request) => {
    const authorizationToken = request.headers.get('Authorization') || '';
    const apiManager = new NovariApiManager({
        baseUrl: API_URL,
        defaultHeaders: {
            Authorization: authorizationToken,
        },
    });

    return {
        components: new ComponentsApi(apiManager),
        contacts: new ContactsApi(apiManager),
        maintenance: new MaintenanceApi(apiManager),
        me: new MeApi(apiManager),
        organisation: new OrganisationApi(apiManager),
    };
};
