import { apiManager } from '~/api/ApiManager';
import logger from '~/components/logger';

const API_URL = process.env.API_URL || '';

// Define an interface for the response data
interface MeApiResponse {
    fullName: string;
}

class MeApi {
    static async getDisplayName() {
        const response = await apiManager<MeApiResponse>({
            method: 'GET',
            url: `${API_URL}/api/me`,
            functionName: 'MeApi',
        });

        logger.debug('response from me:', response.data?.fullName);

        // Check if fullName is empty and handle accordingly
        if (response.data && response.data.fullName === '') {
            logger.info('Using a local testing default ME name');
            return {
                ...response,
                data: {
                    ...response.data,
                    fullName: 'Local Test Name',
                },
            };
        }

        return response;
    }
}

export default MeApi;
