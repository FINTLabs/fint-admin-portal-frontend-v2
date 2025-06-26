import { ActionMenu, Button } from '@navikt/ds-react';
import { MenuElipsisVerticalIcon, NotePencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { IComponent } from '~/types/components';
import { useState } from 'react';
import { ConfirmationModal } from '~/routes/component/ConfirmationModal';

interface ActionMenuProps {
    component: IComponent;
    onEdit: (component: IComponent) => void;
    onDelete: (component: IComponent) => void;
}

export default function ComponentActionMenu({ component, onEdit, onDelete }: ActionMenuProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleDeleteClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        onDelete(component);
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
                component={component}
            />
            <ActionMenu>
                <ActionMenu.Trigger>
                    <Button
                        variant="tertiary-neutral"
                        icon={<MenuElipsisVerticalIcon title="Saksmeny" />}
                        size="small"
                        data-cy="component-action-menu-button"
                    />
                </ActionMenu.Trigger>
                <ActionMenu.Content>
                    <ActionMenu.Group label={`${component.name}`}>
                        <ActionMenu.Item
                            data-cy="component-action-menu"
                            onSelect={() => onEdit(component)}
                            icon={<NotePencilIcon />}>
                            Redigere komponent
                        </ActionMenu.Item>

                        <ActionMenu.Divider />

                        <ActionMenu.Item
                            variant="danger"
                            onSelect={handleDeleteClick}
                            icon={<TrashIcon />}>
                            Slett komponent
                        </ActionMenu.Item>
                    </ActionMenu.Group>
                </ActionMenu.Content>
            </ActionMenu>
        </>
    );
}
