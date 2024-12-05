import { Heading, Table } from '@navikt/ds-react';
import { IComponent } from '~/types/components';

interface ExpandableContentProps {
    component: IComponent;
}

export default function ComponentExpandableRow({ component }: ExpandableContentProps) {
    return (
        <>
            <Heading size={'xsmall'}>Endepunkter</Heading>
            <Table zebraStripes={false}>
                <Table.Body>
                    <Table.Row>
                        <Table.HeaderCell scope="row">Produksjon</Table.HeaderCell>
                        <Table.DataCell textSize={'small'}>
                            https://api.felleskomponent.no{component.basePath}
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell scope="row">Beta</Table.HeaderCell>
                        <Table.DataCell textSize={'small'}>
                            https://beta.felleskomponent.no{component.basePath}
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell scope="row">Play-with-FINT</Table.HeaderCell>
                        <Table.DataCell textSize={'small'}>
                            https://play-with-fint.felleskomponent.no
                            {component.basePath}
                        </Table.DataCell>
                    </Table.Row>
                </Table.Body>
            </Table>
            <Heading size={'xsmall'}>Swagger</Heading>
            <Table>
                <Table.Body>
                    <Table.Row>
                        <Table.HeaderCell scope="row">Produksjon</Table.HeaderCell>
                        <Table.DataCell textSize={'small'}>
                            https://api.felleskomponent.no{component.basePath}/swagger-ui.html
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell scope="row">Beta</Table.HeaderCell>
                        <Table.DataCell textSize={'small'}>
                            https://beta.felleskomponent.no{component.basePath}/swagger-ui.html
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell scope="row">Play-with-FINT</Table.HeaderCell>
                        <Table.DataCell textSize={'small'}>
                            https://play-with-fint.felleskomponent.no
                            {component.basePath}/swagger-ui.html
                        </Table.DataCell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </>
    );
}
