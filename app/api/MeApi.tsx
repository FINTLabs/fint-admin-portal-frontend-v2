import { NovariApiManager } from 'novari-frontend-components';

export interface IUser {
    fullName: string;
}

class MeApi {
    constructor(private apiManager: NovariApiManager) {}

    async getDisplayName() {
        return await this.apiManager.call<IUser>({
            method: 'GET',
            endpoint: '/api/me',
            functionName: 'getMeData',
            customErrorMessage: 'Get me failed',
            customSuccessMessage: 'Get me successful',
        });
    }
}

export default MeApi;
