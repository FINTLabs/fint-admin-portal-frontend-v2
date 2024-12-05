import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '~/api/ApiManager';
import { IAlertType } from '~/types/alert';

function useAlerts<T>(fetcherData: ApiResponse<T>, fetcherState: string) {
    const [alerts, setAlerts] = useState<IAlertType[]>([]);

    useEffect(() => {
        if (fetcherState === 'loading') {
            addAlert({
                variant: fetcherData.variant || 'success',
                message: fetcherData.message || 'Handlingen fullført.',
            });
        }
    }, [fetcherState, fetcherData]);

    const addAlert = useCallback((alert: Omit<IAlertType, 'id'>) => {
        setAlerts((prev) => [
            ...prev,
            {
                id: Date.now(),
                ...alert,
            },
        ]);
    }, []);

    const removeAlert = useCallback((id: number) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, []);

    return {
        alerts,
        addAlert,
        removeAlert,
    };
}

export default useAlerts;
