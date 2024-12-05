import {
    Buildings3Icon,
    ChevronDownIcon,
    ComponentIcon,
    PersonGroupIcon,
    WrenchIcon,
} from '@navikt/aksel-icons';
import { ActionMenu, Button, HGrid } from '@navikt/ds-react';
import { Logo } from '~/components/Logo';
import { Link, useLoaderData } from '@remix-run/react';

const Header = () => {
    const { meData } = useLoaderData<string>();

    return (
        <HGrid gap="3" columns={{ md: '1fr 3fr', xs: '1fr' }} style={{ padding: '1rem' }}>
            <div>
                <Logo />
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '1rem',
                }}>
                <span>{meData.fullName}</span>
                <ActionMenu>
                    <ActionMenu.Trigger>
                        <Button
                            variant="secondary-neutral"
                            icon={<ChevronDownIcon aria-hidden />}
                            iconPosition="right"
                            size={'small'}>
                            Meny
                        </Button>
                    </ActionMenu.Trigger>
                    <ActionMenu.Content>
                        <ActionMenu.Group label="Admin">
                            <Link to="/contact">
                                <ActionMenu.Item icon={<PersonGroupIcon />}>
                                    Kontakter
                                </ActionMenu.Item>
                            </Link>

                            <Link to="/organization">
                                <ActionMenu.Item icon={<Buildings3Icon />}>
                                    Organisasjoner
                                </ActionMenu.Item>
                            </Link>
                            <Link to="/component">
                                <ActionMenu.Item icon={<ComponentIcon />}>
                                    Komponenter
                                </ActionMenu.Item>
                            </Link>
                        </ActionMenu.Group>
                        <ActionMenu.Group label="Reports">
                            <Link to="/tools">
                                <ActionMenu.Item icon={<WrenchIcon />}>Tools</ActionMenu.Item>
                            </Link>
                        </ActionMenu.Group>
                    </ActionMenu.Content>
                </ActionMenu>
            </div>
        </HGrid>
    );
};

export default Header;
