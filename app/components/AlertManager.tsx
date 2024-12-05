import React, { useEffect, useState } from 'react';
import { Alert, BodyShort, VStack } from '@navikt/ds-react';

const AlertManager: React.FC<IAlertStackProps> = ({ alerts, removeAlert }) => {
    const [displayAlerts, setDisplayAlerts] = useState<IAlertType[]>([]);

    const handleRemoveAlert = (id: number) => {
        setDisplayAlerts((prev) => prev.filter((alert) => alert.id !== id));
        removeAlert(id);
    };
    useEffect(() => {
        if (alerts.length) {
            const latestAlert = alerts[alerts.length - 1];

            // Check if the alert is already displayed
            setDisplayAlerts((prev) => {
                if (prev.find((alert) => alert.id === latestAlert.id)) {
                    return prev; // If alert already exists, do nothing
                }

                const updatedAlerts = [...prev, latestAlert];
                if (updatedAlerts.length > 3) {
                    updatedAlerts.shift(); // Remove the oldest alert if more than 3
                }
                return updatedAlerts;
            });

            // Auto-remove the alert after 10 seconds
            setTimeout(() => {
                setDisplayAlerts((prev) => prev.filter((alert) => alert.id !== latestAlert.id));
            }, 10000);
        }
    }, [alerts]);

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
