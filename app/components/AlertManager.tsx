import React, { useEffect, useState, useCallback } from 'react';
import { Alert, BodyShort, VStack } from '@navikt/ds-react';
import { IAlertStackProps, IAlertType } from '~/types/alert';

const AlertManager: React.FC<IAlertStackProps> = ({ alerts, removeAlert }) => {
    const [displayAlerts, setDisplayAlerts] = useState<IAlertType[]>([]);

    useEffect(() => {
        if (alerts.length) {
            const latestAlert = alerts[alerts.length - 1];

            setDisplayAlerts((prev) => {
                if (prev.some((alert) => alert.id === latestAlert.id)) {
                    return prev;
                }
                const updatedAlerts = [...prev, latestAlert];
                return updatedAlerts.length > 3 ? updatedAlerts.slice(1) : updatedAlerts;
            });

            const timer = setTimeout(() => {
                handleRemoveAlert(latestAlert.id);
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [alerts]);

    const handleRemoveAlert = useCallback(
        (id: number) => {
            setDisplayAlerts((prev) => prev.filter((alert) => alert.id !== id));
            removeAlert(id);
        },
        [removeAlert]
    );

    return (
        <VStack
            gap="4"
            style={{
                position: 'fixed',
                top: '5rem',
                right: '1rem',
                zIndex: 1000,
            }}>
            {displayAlerts.map((alert) => (
                <Alert
                    key={alert.id}
                    variant={alert.variant as 'error' | 'info' | 'warning' | 'success'}
                    closeButton
                    size={'small'}
                    onClose={() => handleRemoveAlert(alert.id)}>
                    {alert.header && (
                        <BodyShort size={'small'} style={{ fontWeight: 'bold' }}>
                            {alert.header}
                        </BodyShort>
                    )}
                    <BodyShort size={'small'}>{alert.message}</BodyShort>
                </Alert>
            ))}
        </VStack>
    );
};

export default AlertManager;
