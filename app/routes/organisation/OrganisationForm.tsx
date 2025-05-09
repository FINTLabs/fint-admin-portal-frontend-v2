import { Box, Button, HStack, TextField } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { IOrganisation } from '~/types/organisation';

interface AddOrganizationFormProps {
    organization?: IOrganisation | null;
    onCancel: () => void;
    handleFormSubmit: (formData: FormData) => void;
}
type Errors = { displayName?: string; orgNumber?: string; name?: string };

export default function OrganisationForm({
    organization,
    onCancel,
    handleFormSubmit,
}: AddOrganizationFormProps) {
    const [inDisplayName, setInDisplayName] = useState<string>('');
    const [inOrgNumber, setInOrgNumber] = useState<string>('');
    const [inDomainName, setInDomainName] = useState<string>('');
    const [inDn, setInDn] = useState<string>('');
    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        if (organization) {
            setInDisplayName(organization.displayName);
            setInOrgNumber(organization.orgNumber);
            setInDomainName(organization.name);
            setInDn(organization.dn || '');
        }
    }, [organization]);

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
            handleFormSubmit(formData);
        }
    };

    return (
        <>
            <Box className="p-10">
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
            </Box>
            <HStack className="pl-10" gap="5">
                <Button onClick={onSubmit} data-cy="submit-button">
                    {organization ? 'Oppdater organisasjon' : 'Legg til organisasjon'}
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
            </HStack>
        </>
    );
}
