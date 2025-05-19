import { ActionMenu, Button } from '@navikt/ds-react';
import {
    MenuElipsisVerticalIcon,
    NotePencilIcon,
    PersonGavelIcon,
    PersonMinusIcon,
    TrashIcon,
} from '@navikt/aksel-icons';
import { IOrganisation } from '~/types/organisation';
import { ConfirmationModal } from '~/routes/component/ConfirmationModal';
import { useState } from 'react';

interface OrganisationActionMenu {
    organisation: IOrganisation;
    onEdit: (org: IOrganisation) => void;
    onUnsetLegal: (org: IOrganisation) => void;
    onSelectLegal: (org: IOrganisation) => void;
    onDelete: (org: IOrganisation) => void;
}

export default function OrganisationActionMenu({
    organisation,
    onEdit,
    onUnsetLegal,
    onSelectLegal,
    onDelete,
}: OrganisationActionMenu) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleDeleteClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        onDelete(organisation);
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <ConfirmationModal
                isOpen={isModalOpen}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                bodyText={`${organisation.displayName}`}
            />
            <ActionMenu>
                <ActionMenu.Trigger>
                    <Button
                        variant="tertiary-neutral"
                        icon={<MenuElipsisVerticalIcon title="Saksmeny" />}
                        size="small"
                        data-cy="organisation-action-menu-button"
                    />
                </ActionMenu.Trigger>
                <ActionMenu.Content>
                    <ActionMenu.Group label={`${organisation.name}`}>
                        <ActionMenu.Item
                            data-cy="organisation-action-menu"
                            onSelect={() => onEdit(organisation)}
                            icon={<NotePencilIcon />}>
                            Redigere organisasjon
                        </ActionMenu.Item>
                        <ActionMenu.Item
                            onSelect={() => onUnsetLegal(organisation)}
                            icon={<PersonMinusIcon />}>
                            Fjerne juridisk kontakt
                        </ActionMenu.Item>
                        <ActionMenu.Item
                            onSelect={() => onSelectLegal(organisation)}
                            icon={<PersonGavelIcon />}>
                            Sette juridisk kontakt
                        </ActionMenu.Item>
                        <ActionMenu.Divider />
                        <ActionMenu.Item
                            variant="danger"
                            onSelect={handleDeleteClick}
                            icon={<TrashIcon />}>
                            Slett Organisasjon
                        </ActionMenu.Item>
                    </ActionMenu.Group>
                </ActionMenu.Content>
            </ActionMenu>
        </>
    );
}
