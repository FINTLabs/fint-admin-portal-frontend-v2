import { Link, useLocation } from 'react-router';
import { ChevronRightIcon, HouseIcon } from '@navikt/aksel-icons';
import { IBreadcrumb } from '~/types/breadcrumb';
import { BodyShort, HStack } from '@navikt/ds-react';

interface BreadcrumbsProps {
    breadcrumbs: IBreadcrumb[];
}

export default function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
    const homeLink = '/';
    const linkStyle = { textDecoration: 'none', display: 'flex', alignItems: 'center' };
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <HStack gap="space-2" align="center" marginBlock="space-16">
            <Link to={homeLink} style={linkStyle}>
                <HouseIcon title="Dashboard" fontSize="1.2rem" />
                <BodyShort size="small">Dashboard</BodyShort>
            </Link>

            {breadcrumbs.map(({ name, link }) => (
                <HStack key={link} gap="space-1" align="center">
                    <ChevronRightIcon title="Spacer" />

                    {link === '' || link === currentPath ? (
                        <BodyShort size="small">{name}</BodyShort>
                    ) : (
                        <Link to={link} style={linkStyle}>
                            <BodyShort size="small">{name}</BodyShort>
                        </Link>
                    )}
                </HStack>
            ))}
        </HStack>
    );
}
