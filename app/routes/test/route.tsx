import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Table } from '@navikt/ds-react';

const Example = () => {
    return (
        <div style={{ minHeight: '26rem' }}>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">ID</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {data.map(({ id, status }, i) => {
                        return (
                            <Table.Row key={i + status} shadeOnHover={false}>
                                <Table.HeaderCell scope="row">{id}</Table.HeaderCell>
                                <Table.DataCell>{status}</Table.DataCell>
                                <Table.DataCell align="right">
                                    <ActionMenu>
                                        <ActionMenu.Trigger>
                                            <Button
                                                variant="tertiary-neutral"
                                                icon={<MenuElipsisVerticalIcon title="Saksmeny" />}
                                                size="small"
                                            />
                                        </ActionMenu.Trigger>
                                        <ActionMenu.Content>
                                            <ActionMenu.Group label={`Sak #${id}`}>
                                                <ActionMenu.Item onSelect={console.info}>
                                                    Ta sak
                                                </ActionMenu.Item>

                                                <ActionMenu.Divider />

                                                <ActionMenu.Item
                                                    variant="danger"
                                                    onSelect={console.info}>
                                                    Slett sak
                                                </ActionMenu.Item>
                                            </ActionMenu.Group>
                                        </ActionMenu.Content>
                                    </ActionMenu>
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </div>
    );
};

const data = [
    {
        id: '03121',
        status: 'Avslått',
    },
    {
        id: '16066',
        status: 'Mottatt',
    },
    {
        id: '18124',
        status: 'Godkjent',
    },
    {
        id: '24082',
        status: 'Mottatt',
    },
];

export default Example;
