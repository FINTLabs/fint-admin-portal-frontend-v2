import { Box, Button, HStack, TextField } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { IContact } from '~/types/contact';

interface AddContactFormProps {
    contact?: IContact | null;
    onCancel: () => void;
    handleFormSubmit: (formData: FormData) => void;
}
type Errors = {
    nin?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    mobile?: string;
};

export default function ContactForm({ contact, onCancel, handleFormSubmit }: AddContactFormProps) {
    const [inNin, setInNin] = useState<string>('');
    const [inFirstName, setInFirstName] = useState<string>('');
    const [inLastName, setInLastName] = useState<string>('');
    const [inEmail, setInEmail] = useState<string>('');
    const [inMobile, setInMobile] = useState<string>('');
    const [inDn, setInDn] = useState<string>('');
    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        if (contact?.nin) {
            setInNin(contact.nin);
            setInFirstName(contact.firstName);
            setInLastName(contact.lastName);
            setInEmail(contact.mail);
            setInMobile(contact.mobile);
            setInDn(contact.dn || '');
        }
    }, [contact]);

    const onSubmit = () => {
        const newErrors: Errors = {};
        if (!inNin) {
            newErrors.nin = 'Fødselsnummer er påkrevd';
        }
        if (!inFirstName) {
            newErrors.firstName = 'Fornavn er påkrevd';
        }
        if (!inLastName) {
            newErrors.lastName = 'Etternavn er påkrevd';
        }
        if (!inEmail) {
            newErrors.email = 'E-post informasjon er påkrevd';
        }
        if (!inMobile) {
            newErrors.mobile = 'Mobile informasjon er påkrevd';
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const formData = new FormData();
            formData.append('nin', inNin);
            formData.append('firstName', inFirstName);
            formData.append('lastName', inLastName);
            formData.append('email', inEmail);
            formData.append('mobile', inMobile);
            formData.append('dn', inDn);

            handleFormSubmit(formData);
        }
    };

    return (
        <>
            <Box className={'p-10'}>
                {!contact && (
                    <TextField
                        label="Fødselsnummer"
                        value={inNin}
                        type={'number'}
                        onChange={(e) => setInNin(e.target.value)}
                        error={errors.nin}
                    />
                )}
                <TextField
                    label="Fornavn"
                    value={inFirstName}
                    type={'text'}
                    onChange={(e) => setInFirstName(e.target.value)}
                    error={errors.firstName}
                />
                <TextField
                    label="Etternavn"
                    value={inLastName}
                    type={'text'}
                    onChange={(e) => setInLastName(e.target.value)}
                    error={errors.lastName}
                />
                <TextField
                    label="Email"
                    value={inEmail}
                    type={'email'}
                    onChange={(e) => setInEmail(e.target.value)}
                    error={errors.email}
                />
                <TextField
                    label="Mobile"
                    value={inMobile}
                    type={'tel'}
                    onChange={(e) => setInMobile(e.target.value)}
                    error={errors.mobile}
                />
            </Box>
            <HStack className={'pl-10'} gap={'5'}>
                <Button onClick={onSubmit}>
                    {contact ? 'Oppdater kontakt' : 'Legg til kontakt'}
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
            </HStack>
        </>
    );
}
