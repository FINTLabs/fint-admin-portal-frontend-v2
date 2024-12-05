import { ActionMenu, Button } from '@navikt/ds-react';
import {
    MenuElipsisVerticalIcon,
    PersonCrossIcon,
    PersonEnvelopeIcon,
    PersonPencilIcon,
} from '@navikt/aksel-icons';
import { IContact } from '~/types/contact';

interface ActionMenuProps {
    contact: IContact;
    onEdit: (contact: IContact) => void;
    onDelete: (contact: IContact) => void;
}

export default function ContactActionMenu({ contact, onEdit, onDelete }: ActionMenuProps) {
    const handleEmailClick = (contact: IContact) => {
        const mailtoLink = `mailto:${contact.mail}`;
        window.open(mailtoLink, '_blank');
    };
    return (
        <ActionMenu>
            <ActionMenu.Trigger>
                <Button
                    variant="tertiary-neutral"
                    icon={<MenuElipsisVerticalIcon title="Saksmeny" />}
                    size="small"
                />
            </ActionMenu.Trigger>
            <ActionMenu.Content>
                <ActionMenu.Group label={`${contact.firstName} ${contact.lastName}`}>
                    <ActionMenu.Item onSelect={() => onEdit(contact)} icon={<PersonPencilIcon />}>
                        Redigere kontakt
                    </ActionMenu.Item>
                    <ActionMenu.Item
                        onSelect={() => handleEmailClick(contact)}
                        icon={<PersonEnvelopeIcon />}>
                        Send e-post til kontakt
                    </ActionMenu.Item>
                    <ActionMenu.Divider />

                    <ActionMenu.Item
                        variant="danger"
                        onSelect={() => onDelete(contact)}
                        icon={<PersonCrossIcon />}>
                        Slett kontakt
                    </ActionMenu.Item>
                </ActionMenu.Group>
            </ActionMenu.Content>
        </ActionMenu>
    );
}
