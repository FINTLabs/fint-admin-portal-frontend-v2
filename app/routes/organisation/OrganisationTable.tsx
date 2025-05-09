import { Table } from '@navikt/ds-react';
import { IContact } from '~/types/contact';
import { IOrganisation } from '~/types/organisation';
import OrganisationContactModal from '~/routes/organisation/OrganisationContactModal';
import { useState } from 'react';
import OrganisationExpandableRow from '~/routes/organisation/OrganisationExpandableRow';
import OrganisationActionMenu from '~/routes/organisation/OrganisationActionMenu';

interface ContactsTableProps {
    contacts: IContact[];
    organisations: IOrganisation[];
    onEdit: (org: IOrganisation) => void;
    onSetLegal: (formData: FormData) => void;
    onUnsetLegal: (org: IOrganisation) => void;
    onDelete: (org: IOrganisation) => void;
}

export default function OrganisationTable({
    contacts,
    organisations,
    onEdit,
    onSetLegal,
    onUnsetLegal,
    onDelete,
}: ContactsTableProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedOrganisation, setSelectedOrganisation] = useState<IOrganisation>();

    function onSelectLegal(org: IOrganisation) {
        setSelectedOrganisation(org);
        setIsModalOpen(true);
    }

    function handleSetLegal(formData: FormData) {
        formData.append('name', selectedOrganisation?.name as string);
        onSetLegal(formData);
    }

    return (
        <>
            <OrganisationContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                contacts={contacts || []}
                onAddContact={handleSetLegal}
            />
            <Table size="small" zebraStripes={true}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Visningsnavn</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Primær Asset ID</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Rediger</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {organisations.map((org) => (
                        <Table.ExpandableRow
                            data-cy="organisation-row"
                            key={org.dn}
                            content={
                                <OrganisationExpandableRow organisation={org} contacts={contacts} />
                            }>
                            <Table.DataCell>{org.name}</Table.DataCell>
                            <Table.DataCell>{org.displayName}</Table.DataCell>
                            <Table.DataCell>{org.primaryAssetId}</Table.DataCell>
                            <Table.DataCell>
                                <OrganisationActionMenu
                                    organisation={org}
                                    onEdit={onEdit}
                                    onUnsetLegal={onUnsetLegal}
                                    onSelectLegal={onSelectLegal}
                                    onDelete={onDelete}
                                />
                            </Table.DataCell>
                        </Table.ExpandableRow>
                    ))}
                </Table.Body>
            </Table>
        </>
    );
}
