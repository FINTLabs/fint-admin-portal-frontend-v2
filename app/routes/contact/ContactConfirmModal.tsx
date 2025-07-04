import { useRef } from 'react';
import { BodyLong, Button, Modal } from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { IContact } from '~/types/contact';

interface ConfirmationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    contact: IContact;
}

export function ContactConfirmModal({
    isOpen,
    onConfirm,
    onCancel,
    contact,
}: ConfirmationModalProps) {
    const ref = useRef<HTMLDialogElement>(null);

    if (isOpen) {
        ref.current?.showModal();
    } else {
        ref.current?.close();
    }

    return (
        <Modal ref={ref} header={{ heading: 'Bekreft sletting' }} closeOnBackdropClick>
            <Modal.Body>
                <BodyLong>
                    er du sikker på at du vil slette: {`${contact.firstName} ${contact.lastName}`}
                </BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    icon={<TrashIcon title="a11y-title" fontSize="1.5rem" />}
                    type="button"
                    variant={'danger'}
                    size={'small'}
                    onClick={() => {
                        ref.current?.close();
                        onConfirm();
                    }}>
                    Bekreft
                </Button>
                <Button
                    size={'small'}
                    type="button"
                    variant="secondary"
                    onClick={() => {
                        ref.current?.close();
                        onCancel();
                    }}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
