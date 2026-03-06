import { Box, Button, HStack, Label, TextField, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { IOrganisation } from '~/types/organisation';
import { IContact } from '~/types/contact';
import OrganisationContactModal from './OrganisationContactModal';
import { PersonPlusIcon } from '@navikt/aksel-icons';

interface AddOrganizationFormProps {
    organization?: IOrganisation | null;
    onCancel: () => void;
    handleFormSubmit: (formData: FormData) => void;
    contacts: IContact[];
}
type Errors = { displayName?: string; orgNumber?: string; name?: string };

export default function OrganisationForm({
    organization,
    onCancel,
    handleFormSubmit,
    contacts,
}: AddOrganizationFormProps) {
    const [inDisplayName, setInDisplayName] = useState<string>('');
    const [inOrgNumber, setInOrgNumber] = useState<string>('');
    const [inDomainName, setInDomainName] = useState<string>('');
    const [inDn, setInDn] = useState<string>('');
    const [selectedLegalContact, setSelectedLegalContact] = useState<IContact | null>(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        if (organization) {
            setInDisplayName(organization.displayName);
            setInOrgNumber(organization.orgNumber);
            setInDomainName(organization.name);
            setInDn(organization.dn || '');
            // If editing, try to find the legal contact
            if (organization.legalContact) {
                const contactNin = organization.legalContact.split('cn=')[1]?.split(',')[0];
                const contact = contacts.find((c) => c.nin === contactNin);
                if (contact) {
                    setSelectedLegalContact(contact);
                }
            }
        }
    }, [organization, contacts]);

    const handleLegalContactSelect = (formData: FormData) => {
        const contactNin = formData.get('contactNin') as string;
        const contact = contacts.find((c) => c.nin === contactNin);
        if (contact) {
            setSelectedLegalContact(contact);
        }
    };

    const removeLegalContact = () => {
        setSelectedLegalContact(null);
    };

    const onSubmit = () => {
        const newErrors: Errors = {};
        if (!inDisplayName) {
            newErrors.displayName = 'Vist navn er påkrevd';
        }
        if (!inOrgNumber) {
            newErrors.orgNumber = 'Organisasjonsnummer er påkrevd';
        }
        if (!organization && !inDomainName) {
            newErrors.name = 'Domenenavn er påkrevd';
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const formData = new FormData();
            formData.append('displayName', inDisplayName);
            formData.append('orgNumber', inOrgNumber);
            formData.append('name', inDomainName);
            formData.append('dn', inDn);
            if (selectedLegalContact?.nin) {
                formData.append('legalContactNin', selectedLegalContact.nin);
            }
            handleFormSubmit(formData);
        }
    };

    return (
        <>
            <Box
                borderRadius={'12'}
                borderWidth={'1'}
                borderColor="neutral-subtle"
                padding={'space-24'}
                width={'100%'}
                marginBlock={'space-6'}>
                <VStack gap="space-4">
                    <TextField
                        label="Vist navn"
                        value={inDisplayName}
                        onChange={(e) => setInDisplayName(e.target.value)}
                        error={errors.displayName}
                        data-cy={'name-input'}
                    />
                    <TextField
                        label="Organisasjonsnummer"
                        value={inOrgNumber}
                        onChange={(e) => setInOrgNumber(e.target.value)}
                        error={errors.orgNumber}
                        data-cy={'org-number-input'}
                    />
                    <TextField
                        label="Domenenavn (f.eks. rfk.no)"
                        value={inDomainName}
                        onChange={(e) => setInDomainName(e.target.value)}
                        error={errors.name}
                        disabled={!!organization}
                        data-cy={'display-name-input'}
                    />

                    {/* Legal Contact Section */}
                    <VStack gap="space-2" align="start">
                        <Label>Juridisk kontakt</Label>
                        {selectedLegalContact ? (
                            <span className="text-sm text-gray-600">
                                {selectedLegalContact.firstName} {selectedLegalContact.lastName}
                            </span>
                        ) : (
                            <span className="text-sm text-gray-400">Ingen valgt</span>
                        )}
                        <HStack gap="space-4" marginBlock={'space-16'}>
                            <Button
                                size="small"
                                variant="secondary"
                                onClick={() => setIsContactModalOpen(true)}
                                icon={<PersonPlusIcon />}>
                                {selectedLegalContact
                                    ? 'Endre juridisk kontakt'
                                    : 'Velg juridisk kontakt'}
                            </Button>
                            {selectedLegalContact && (
                                <Button
                                    size="small"
                                    variant="tertiary"
                                    onClick={removeLegalContact}>
                                    Fjern
                                </Button>
                            )}
                        </HStack>
                    </VStack>
                </VStack>
            </Box>

            <HStack gap="space-6" justify="end" marginBlock={'space-24'}>
                <Button onClick={onSubmit} data-cy="submit-button">
                    {organization ? 'Oppdater organisasjon' : 'Legg til organisasjon'}
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
            </HStack>

            {/* Legal Contact Selection Modal */}
            <OrganisationContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                contacts={contacts}
                onAddContact={handleLegalContactSelect}
            />
        </>
    );
}
