import { useRef, useState } from 'react';
import { BodyLong, Button, Modal, TextField } from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { IComponent } from '~/types/components';

interface ConfirmationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    component: IComponent;
}

export function ConfirmationModal({
    isOpen,
    onConfirm,
    onCancel,
    component,
}: ConfirmationModalProps) {
    const ref = useRef<HTMLDialogElement>(null);
    const [confirmationInput, setConfirmationInput] = useState('');

    const connectedClients = component.clients?.length || 0;
    const connectedAdapters = component.adapters?.length || 0;
    const requiredPath = component.basePath || '';
    const isValid = confirmationInput === requiredPath;

    if (isOpen) {
        ref.current?.showModal();
    } else {
        ref.current?.close();
    }

    return (
        <Modal ref={ref} header={{ heading: 'Bekreft sletting' }} closeOnBackdropClick>
            <Modal.Body>
                <BodyLong className="mb-4">
                    Du er i ferd med å slette komponenten <strong>{component.name}</strong>.
                    <br />
                    Denne komponenten er koblet til <strong>{connectedAdapters}</strong> adaptere og{' '}
                    <strong>{connectedClients}</strong> klienter.
                    <br />
                    <br />
                    For å bekrefte sletting, skriv inn komponentens basepath:{' '}
                    <code>{requiredPath}</code>
                </BodyLong>
                <TextField
                    label="Bekreft basepath"
                    value={confirmationInput}
                    onChange={(e) => setConfirmationInput(e.target.value)}
                    size="small"
                    placeholder="/xyz/abc"
                />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    icon={<TrashIcon title="a11y-title" fontSize="1.5rem" />}
                    type="button"
                    variant="danger"
                    size="small"
                    disabled={!isValid}
                    onClick={() => {
                        ref.current?.close();
                        onConfirm();
                        setConfirmationInput('');
                    }}>
                    Bekreft
                </Button>
                <Button
                    size="small"
                    type="button"
                    variant="secondary"
                    onClick={() => {
                        ref.current?.close();
                        onCancel();
                        setConfirmationInput('');
                    }}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
