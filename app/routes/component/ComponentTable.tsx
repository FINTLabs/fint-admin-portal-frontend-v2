import { Table, Tag } from '@navikt/ds-react';
import ComponentExpandableRow from './ComponentExpandableRow';
import { IComponent } from '~/types/components';
import ComponentActionMenu from '~/routes/component/ComponentActionMenu';

interface ContactsTableProps {
    components: IComponent[];
    onEdit: (component: IComponent) => void;
    onDelete: (component: IComponent) => void;
}

export default function ComponentTable({ components, onEdit, onDelete }: ContactsTableProps) {
    return (
        <Table size="small">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell>Navn</Table.HeaderCell>
                    <Table.HeaderCell>Beskrivelse</Table.HeaderCell>
                    <Table.HeaderCell>Miljøer</Table.HeaderCell>
                    <Table.HeaderCell>Typer</Table.HeaderCell>
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {components.map((component) => (
                    <Table.ExpandableRow
                        data-cy="component-row"
                        key={component.dn}
                        content={<ComponentExpandableRow component={component} />}>
                        <Table.DataCell>{component.name}</Table.DataCell>
                        <Table.DataCell>{component.description}</Table.DataCell>
                        <Table.DataCell>
                            {component.inBeta && (
                                <Tag variant="warning" size={'xsmall'}>
                                    Beta
                                </Tag>
                            )}
                            {component.inProduction && (
                                <Tag variant="success" size={'xsmall'}>
                                    API
                                </Tag>
                            )}
                            {component.inPlayWithFint && (
                                <Tag variant="info" size={'xsmall'}>
                                    PWF
                                </Tag>
                            )}
                        </Table.DataCell>
                        <Table.DataCell>
                            {component.core && (
                                <Tag variant="neutral" size={'xsmall'}>
                                    Core
                                </Tag>
                            )}
                            {component.openData && (
                                <Tag variant="info" size={'xsmall'}>
                                    Open Data
                                </Tag>
                            )}
                            {component.common && (
                                <Tag variant="neutral" size={'xsmall'}>
                                    Common
                                </Tag>
                            )}
                        </Table.DataCell>
                        <Table.DataCell>
                            <ComponentActionMenu
                                component={component}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        </Table.DataCell>
                    </Table.ExpandableRow>
                ))}
            </Table.Body>
        </Table>
    );
}
