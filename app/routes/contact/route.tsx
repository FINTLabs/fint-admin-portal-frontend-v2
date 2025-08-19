import { ActionFunction, LoaderFunction, useFetcher, useLoaderData } from 'react-router';
import { Box, Pagination, Search } from '@navikt/ds-react';
import { IContact } from '~/types/contact';
import ContactsApi from '~/api/ContactsApi';
import { useState } from 'react';
import OrganisationsApi from '~/api/OrganisationApi';
import { IOrganisation } from '~/types/organisation';
import InternalPageHeader from '~/components/InternalPageHeader';
import { PersonGroupIcon } from '@navikt/aksel-icons';
import logger from '~/components/logger';
import ContactForm from '~/routes/contact/ContactForm';
import ContactsTable from '~/routes/contact/ContactsTable';
import {
    ApiResponse,
    NovariSnackbar,
    NovariSnackbarItem,
    useAlerts,
} from 'novari-frontend-components';

export const loader: LoaderFunction = async () => {
    let contacts: IContact[] = [];
    let organisations: IOrganisation[] = [];
    const alerts: NovariSnackbarItem[] = [];

    const contactsResult = await ContactsApi.getContacts();
    const organisationsResult = await OrganisationsApi.getOrganisations();

    if (!contactsResult.success) {
        alerts.push({
            id: 'contact-load-error',
            variant: contactsResult.variant,
            message: contactsResult.message,
        });
    } else {
        contacts = contactsResult.data || [];
    }

    if (!organisationsResult.success) {
        alerts.push({
            id: 'org-load-error',
            variant: organisationsResult.variant,
            message: organisationsResult.message,
        });
    } else {
        organisations = organisationsResult.data || [];
    }

    if (contacts.length > 0) {
        contacts.sort((a, b) => a.firstName.localeCompare(b.firstName));
    }

    return Response.json({ contacts, organisations, alerts });
};

export default function ContactsPage() {
    const { contacts, organisations, alerts } = useLoaderData<{
        contacts: IContact[];
        organisations: IOrganisation[];
        alerts: NovariSnackbarItem[];
    }>();

    const fetcher = useFetcher();
    const actionData = fetcher.data as ApiResponse<IContact>;
    const { alertState, handleCloseItem } = useAlerts<IContact>(alerts, actionData);

    const [editingContact, setEditingContact] = useState<IContact | null>(null);
    const [addingNew, setAddingNew] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const filteredContacts = contacts.filter(
        (contact) =>
            `${contact.firstName} ${contact.lastName}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            contact.mail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.mobile.includes(searchQuery)
    );
    const itemsPerPage = 15;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

    const breadcrumbs = [{ name: 'Kontakter', link: '/contact' }];

    const handleFormSubmit = (formData: FormData) => {
        const actionType = editingContact ? 'EDIT_CONTACT' : 'ADD_NEW_CONTACT';
        formData.append('actionType', actionType);
        fetcher.submit(formData, { method: 'POST' });
        setAddingNew(false);
        setEditingContact(null);
    };

    function handleDelete(deleteContact: IContact) {
        const formData = new FormData();
        formData.append('actionType', 'DELETE_CONTACT');
        formData.append('nin', deleteContact.nin as string);
        fetcher.submit(formData, { method: 'POST' });
    }

    return (
        <div>
            <InternalPageHeader
                title={addingNew ? 'Legg til ny kontakt' : 'Kontakter'}
                icon={PersonGroupIcon}
                breadcrumbs={breadcrumbs}
                onActionButtonClick={
                    !addingNew && !editingContact ? () => setAddingNew(true) : undefined
                }
            />
            <NovariSnackbar
                items={alertState}
                position={'top-right'}
                onCloseItem={handleCloseItem}
            />

            {addingNew || editingContact ? (
                <ContactForm
                    contact={editingContact}
                    onCancel={() => {
                        setAddingNew(false);
                        setEditingContact(null);
                    }}
                    handleFormSubmit={handleFormSubmit}
                />
            ) : (
                <>
                    <Box className={'pt-10 w-100 pb-10'}>
                        <Search
                            label="Search contacts"
                            variant="simple"
                            value={searchQuery}
                            onChange={(value: string) => setSearchQuery(value)}
                            size="small"
                            data-cy={'contact-search-box'}
                        />
                    </Box>

                    <ContactsTable
                        contacts={paginatedContacts}
                        organisations={organisations}
                        onEdit={(contact: IContact) => setEditingContact(contact)}
                        onDelete={(contact: IContact) => handleDelete(contact)}
                    />

                    {filteredContacts.length > 15 && (
                        <Pagination
                            page={currentPage}
                            onPageChange={(page: number) => setCurrentPage(page)}
                            count={Math.ceil(filteredContacts.length / itemsPerPage)}
                            size="small"
                            className={'pt-10'}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const actionType = formData.get('actionType') as string;
    const newContact: IContact = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        mail: formData.get('email') as string,
        mobile: formData.get('mobile') as string,
    };
    logger.debug(`Received action: ${actionType} in contact route`);

    switch (actionType) {
        case 'ADD_NEW_CONTACT':
            logger.info('Adding new contact', newContact);
            newContact.nin = formData.get('nin') as string;
            return await ContactsApi.addContact(newContact);

        case 'EDIT_CONTACT':
            newContact.nin = formData.get('nin') as string;
            newContact.dn = formData.get('dn') as string;
            logger.info('Editing contact', newContact);
            return await ContactsApi.updateContact(newContact);

        // case 'DELETE_CONTACT':
        //     newContact.nin = formData.get('nin') as string;
        //     logger.info('Removing contact', newContact);
        //     return await ContactsApi.deleteContact(newContact);

        default:
            return {
                success: false,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
    }
};
