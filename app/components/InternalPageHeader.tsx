import React from 'react';
import { Box, Button, Heading, Hide, HStack, VStack } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/aksel-icons';
import Breadcrumbs from './Breadcrumbs';
import { IBreadcrumb } from '~/types/breadcrumb';

interface LayoutHeaderProps {
    icon?: React.ElementType;
    title: string;
    breadcrumbs?: IBreadcrumb[];
    onActionButtonClick?: () => void; // New prop for the action button click handler
}

function InternalPageHeader({
    icon: IconComponent,
    title,
    breadcrumbs,
    onActionButtonClick,
}: LayoutHeaderProps) {
    return (
        <Box className={'pb-10'}>
            <VStack gap={'3'}>
                {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs breadcrumbs={breadcrumbs} />}

                <HStack justify="space-between" align="center" gap="2">
                    <HStack gap="2">
                        <Hide below="md">
                            {IconComponent && (
                                <IconComponent title="Header Icon" fontSize="2.5rem" />
                            )}
                        </Hide>
                        <Heading level="1" size="large">
                            {title}
                        </Heading>
                    </HStack>
                    {onActionButtonClick && (
                        <Button
                            size="small"
                            icon={<PlusIcon aria-hidden />}
                            onClick={onActionButtonClick}>
                            Legg til
                        </Button>
                    )}
                </HStack>
            </VStack>
        </Box>
    );
}

export default InternalPageHeader;
