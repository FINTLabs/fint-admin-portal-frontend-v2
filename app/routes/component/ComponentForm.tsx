import { Box, Button, Checkbox, HStack, Label, TextField, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { IComponent } from '~/types/components';

interface AddComponentFormProps {
    component?: IComponent | null;
    onCancel: () => void;
    handleFormSubmit: (formData: FormData) => void;
}

type Errors = {
    name?: string;
    basePath?: string;
    description?: string;
};

export default function ComponentForm({
    component,
    onCancel,
    handleFormSubmit,
}: AddComponentFormProps) {
    const [inName, setInName] = useState<string>('');
    const [inBasePath, setInBasePath] = useState<string>('');
    const [inDescription, setInDescription] = useState<string>('');

    const [inBeta, setInBeta] = useState<boolean>(false);
    const [inProduction, setInProduction] = useState<boolean>(false);
    const [inPlayWithFint, setInPlayWithFint] = useState<boolean>(false);

    const [inCore, setInCore] = useState<boolean>(false);
    const [inOpenData, setInOpenData] = useState<boolean>(false);
    const [inCommon, setInCommon] = useState<boolean>(false);

    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        if (component) {
            setInName(component.name);
            setInBasePath(component.basePath);
            setInDescription(component.description);
            setInBeta(component.inBeta);
            setInProduction(component.inProduction);
            setInPlayWithFint(component.inPlayWithFint);
            setInCore(component.core);
            setInOpenData(component.openData);
            setInCommon(component.common);
        }
    }, [component]);

    const onSubmit = () => {
        const newErrors: Errors = {};
        if (!inName) {
            newErrors.name = 'Navn er påkrevd';
        }
        if (!inDescription) {
            newErrors.description = 'Beskrivelse er påkrevd';
        }
        if (!inBasePath) {
            newErrors.basePath = 'Basepath er påkrevd';
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const formData = new FormData();
            formData.append('name', inName);
            formData.append('description', inDescription);
            formData.append('basePath', inBasePath);
            formData.append('inBeta', inBeta.toString());
            formData.append('inProduction', inProduction.toString());
            formData.append('inPlayWithFint', inPlayWithFint.toString());
            formData.append('core', inCore.toString());
            formData.append('openData', inOpenData.toString());
            formData.append('common', inCommon.toString());

            if (component?.dn) {
                formData.append('dn', component.dn);
            }

            handleFormSubmit(formData);
        }
    };

    return (
        <>
            <Box className="p-10">
                {component ? (
                    <TextField label="Navn" value={inName} disabled={true} />
                ) : (
                    <TextField
                        data-cy="name-input"
                        label="Navn"
                        value={inName}
                        onChange={(e) => setInName(e.target.value)}
                        error={errors.name}
                    />
                )}

                <TextField
                    label="BasePath"
                    value={inBasePath}
                    onChange={(e) => setInBasePath(e.target.value)}
                    error={errors.basePath}
                    data-cy="basePath-input"
                />
                <TextField
                    label="Beskrivelse"
                    value={inDescription}
                    onChange={(e) => setInDescription(e.target.value)}
                    error={errors.description}
                    data-cy="description-input"
                />
                <HStack gap={'10'} className={'pt-5'}>
                    <VStack>
                        <Label> Miljøer</Label>
                        <Checkbox
                            onChange={(e) => setInBeta(e.target.checked)}
                            checked={inBeta}
                            data-cy="inBeta-checkbox">
                            Beta
                        </Checkbox>
                        <Checkbox
                            checked={inProduction}
                            onChange={(e) => setInProduction(e.target.checked)}>
                            I produksjon
                        </Checkbox>
                        <Checkbox
                            checked={inPlayWithFint}
                            onChange={(e) => setInPlayWithFint(e.target.checked)}>
                            Play with FINT
                        </Checkbox>
                    </VStack>

                    <VStack>
                        {' '}
                        <Label> Type</Label>
                        <Checkbox checked={inCore} onChange={(e) => setInCore(e.target.checked)}>
                            Core
                        </Checkbox>
                        <Checkbox
                            checked={inOpenData}
                            onChange={(e) => setInOpenData(e.target.checked)}>
                            Open Data
                        </Checkbox>
                        <Checkbox
                            checked={inCommon}
                            onChange={(e) => setInCommon(e.target.checked)}
                            data-cy="common-checkbox">
                            Common
                        </Checkbox>
                    </VStack>
                </HStack>
            </Box>
            <HStack className="pl-10" gap="5">
                <Button onClick={onSubmit} data-cy="submit-button">
                    {component ? 'Update Component' : 'Add Component'}
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
            </HStack>
        </>
    );
}
