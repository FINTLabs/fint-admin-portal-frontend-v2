import { Table } from '@navikt/ds-react';
import { IContact } from '~/types/contact';
import { IOrganisation } from '~/types/organisation';
import ContactActionMenu from '~/routes/contact/ContactActionMenu';

interface ContactsTableProps {
    contacts: IContact[];
    organisations: IOrganisation[];
    onEdit: (contact: IContact) => void;
    onDelete: (contact: IContact) => void;
}

export default function ContactsTable({
    contacts,
    organisations,
    onEdit,
    onDelete,
}: ContactsTableProps) {
    const getOrgNamesByTechnicalIds = (technicalIds: string[]): string[] => {
        return technicalIds
            .map((technicalId) => organisations.find((org) => org.dn === technicalId)?.name || '')
            .filter((name) => name !== '');
    };

    return (
        <Table size="small" zebraStripes={true}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell scope="col">Fornavn</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Etternavn</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Organisasjon</Table.HeaderCell>
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {contacts.map((contact) => (
                    <Table.ExpandableRow
                        data-cy="contact-row"
                        key={contact.dn}
                        content={
                            <>
                                <div>
                                    <strong>E-post:</strong> {contact.mail}
                                </div>
                                <div>
                                    <strong>Mobil:</strong> {contact.mobile}
                                </div>
                            </>
                        }>
                        <Table.DataCell>{contact.firstName}</Table.DataCell>
                        <Table.DataCell>{contact.lastName}</Table.DataCell>
                        <Table.DataCell>
                            {getOrgNamesByTechnicalIds(contact.technical || []).join(', ')}
                        </Table.DataCell>
                        <Table.DataCell>
                            <ContactActionMenu
                                contact={contact}
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
