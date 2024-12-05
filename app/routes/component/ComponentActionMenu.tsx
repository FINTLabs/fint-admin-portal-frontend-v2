import { ActionMenu, Button } from '@navikt/ds-react';
import { MenuElipsisVerticalIcon, NotePencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { IComponent } from '~/types/components';

interface ActionMenuProps {
    component: IComponent;
    onEdit: (component: IComponent) => void;
    onDelete: (component: IComponent) => void;
}

export default function ComponentActionMenu({ component, onEdit, onDelete }: ActionMenuProps) {
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
                <ActionMenu.Group label={`${component.name}`}>
                    <ActionMenu.Item onSelect={() => onEdit(component)} icon={<NotePencilIcon />}>
                        Redigere komponent
                    </ActionMenu.Item>

                    <ActionMenu.Divider />

                    <ActionMenu.Item
                        variant="danger"
                        onSelect={() => onDelete(component)}
                        icon={<TrashIcon />}>
                        Slett komponent
                    </ActionMenu.Item>
                </ActionMenu.Group>
            </ActionMenu.Content>
        </ActionMenu>
    );
}
