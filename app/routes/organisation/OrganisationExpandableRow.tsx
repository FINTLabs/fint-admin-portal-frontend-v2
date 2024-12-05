import { BodyShort, Heading, List } from '@navikt/ds-react';
import { IOrganisation } from '~/types/organisation';
import { IContact } from '~/types/contact';

interface ExpandableRowProps {
    organisation: IOrganisation;
    contacts: IContact[];
}

export default function OrganisationExpandableRow({ organisation, contacts }: ExpandableRowProps) {
    const getContactsByOrg = (orgDn: string) => {
        return contacts.filter((contact) => contact.technical?.includes(orgDn));
    };

    const getLegalContact = (legalContactDn: string) => {
        return contacts.find((contact) => contact.dn === legalContactDn);
    };

    return (
        <>
            <Heading size="small">Juridisk kontakter</Heading>
            {organisation.legalContact ? (
                <List as="ul" size="small">
                    {(() => {
                        const legalContact = getLegalContact(organisation.legalContact);
                        return legalContact ? (
                            <List.Item key={legalContact.dn}>
                                {legalContact.firstName} {legalContact.lastName} -{' '}
                                {legalContact.mail}
                            </List.Item>
                        ) : (
                            <List.Item>Ingen juridisk kontakt funnet</List.Item>
                        );
                    })()}
                </List>
            ) : (
                <BodyShort size={'small'}>Ingen juridisk kontakt</BodyShort>
            )}
            <Heading size="small">Tekniske kontakter</Heading>
            {organisation.dn && getContactsByOrg(organisation.dn).length > 0 ? (
                <List as="ul" size="small">
                    {getContactsByOrg(organisation.dn).map((contact) => (
                        <List.Item key={contact.dn}>
                            {contact.firstName} {contact.lastName} - {contact.mail}
                        </List.Item>
                    ))}
                </List>
            ) : (
                <BodyShort size={'small'}>Ingen tekniske kontakt funnet</BodyShort>
            )}
        </>
    );
}
