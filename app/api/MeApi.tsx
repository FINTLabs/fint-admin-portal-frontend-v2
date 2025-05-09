import { NovariApiManager } from 'novari-frontend-components';

const API_URL = process.env.API_URL || '';

export interface IUser {
    fullName: string;
}

class MeApi {
    static async getDisplayName() {
        const apiManager = new NovariApiManager({
            baseUrl: API_URL,
            // defaultHeaders: { 'x-nin': '9999999999' },
        });

        return await apiManager.call<IUser>({
            method: 'GET',
            endpoint: '/api/me',
            functionName: 'getMeData',
            customErrorMessage: 'Get me failed',
            customSuccessMessage: 'Get me successful',
        });
    }
}

export default MeApi;
