import { useState, useEffect } from 'react';
import { IFetcherResponseMessage } from '~/types/FetcherResponseData';

function useAlerts(fetcherData: IFetcherResponseMessage, fetcherState: string) {
    const [alerts, setAlerts] = useState<IAlertType[]>([]);

    useEffect(() => {
        if (fetcherState === 'loading') {
            addAlert({
                variant: fetcherData.variant || 'success',
                message: fetcherData.message || 'Handlingen fullført.',
            });
        }
    }, [fetcherState]);

    const addAlert = (alert: Omit<IAlertType, 'id'>) => {
        setAlerts((prev) => [
            ...prev,
            {
                id: Date.now(),
                ...alert,
            },
        ]);
    };

    const removeAlert = (id: number) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    return {
        alerts,
        addAlert,
        removeAlert,
    };
}

export default useAlerts;
