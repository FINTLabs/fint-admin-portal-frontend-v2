import logger from '~/components/logger';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiCallOptions {
    method: HttpMethod;
    url: string;
    body?: string;
    headers?: Record<string, string>;
    functionName?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    variant: 'success' | 'error' | 'warning';
    data?: T;
}

export async function apiManager<T>({
    method,
    url,
    body,
    headers,
    functionName,
}: ApiCallOptions): Promise<{ success: boolean; data?: T; message?: string; status?: number }> {
    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };

    const requestOptions: RequestInit = {
        method,
        headers: defaultHeaders,
    };

    if (body && method !== 'GET') {
        requestOptions.body = body;
    }

    logger.info(`API URL: ${url}`);

    try {
        const response = await fetch(url, requestOptions);
        logger.info(`API Response ${functionName} ${response.status}`);

        if (!response.ok) {
            const errorMessage = await response.text();
            logger.error(`Response from ${functionName}: ${errorMessage}`);
            return {
                success: false,
                message: `Error: ${errorMessage} (Status: ${response.status})`,
                status: response.status,
            };
        }

        let data: T | undefined = undefined;
        if (response.status !== 202) {
            try {
                data = await response.json();
            } catch {
                logger.warn(`No JSON returned for ${functionName}, status ${response.status}`);
            }
        }

        return { success: true, data, message: 'Operasjon vellykket', status: response.status };
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error('API response Error:', err.message);
            return {
                success: false,
                message: `Det oppstod en uventet feil: ${err.message}`,
                status: 500,
            };
        } else {
            logger.error('API response Error: An unknown error occurred');
            return {
                success: false,
                message: 'Det oppstod en uventet feil: Uventet feiltype',
                status: 500,
            };
        }
    }
}

export function handleApiResponse<T>(
    apiResults: { success: boolean; data?: T; message?: string; status?: number },
    errorMessage: string,
    successMessage: string = '',
    successVariant: 'success' | 'warning' = 'success'
): ApiResponse<T> {
    return {
        success: apiResults.success,
        message: apiResults.success ? successMessage : `${errorMessage}: ${apiResults.message}`,
        variant: apiResults.success ? successVariant : 'error',
        data: apiResults.success ? apiResults.data : undefined,
    };
}
