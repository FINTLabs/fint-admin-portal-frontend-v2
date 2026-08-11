import { HGrid } from '@navikt/ds-react';
import { Buildings3Icon, ComponentIcon, PersonGroupIcon, WrenchIcon } from '@navikt/aksel-icons';
import { NovariLinkCard } from 'novari-frontend-components';
import { LoaderFunction, useLoaderData } from 'react-router';
import { IContact } from '~/types/contact';
import ContactsApi from '~/api/ContactsApi';
import { IOrganisation } from '~/types/organisation';
import OrganisationApi from '~/api/OrganisationApi';
import { IComponent } from '~/types/components';
import ComponentsApi from '~/api/ComponentsApi';

export const loader: LoaderFunction = async () => {
    const contactsResult = await ContactsApi.getContacts();
    const orgResult = await OrganisationApi.getOrganisations();
    const componentResult = await ComponentsApi.getComponents();
    const contacts = contactsResult.data || [];
    const organisations = orgResult.data || [];
    const components = componentResult.data || [];
    console.log(components);
    return Response.json({ contacts, organisations, components });
};

export default function Index() {
    const { contacts, organisations, components } = useLoaderData<{
        contacts: IContact[];
        organisations: IOrganisation[];
        components: IComponent[];
    }>();
    return (
        <>
            <HGrid columns={2} gap="space-8" marginBlock="space-64">
                <NovariLinkCard
                    Icon={<PersonGroupIcon title="a11y-title" fontSize="1.5rem" />}
                    border
                    description={`Antall kontakter: ${contacts.length}`}
                    hover
                    link={'/contact'}
                    title="Kontakter"
                    className="home-link-card"
                    style={{
                        '--novari-link-card-arrow-color': '#0067c5',
                        '--novari-link-card-hover-color': '#e6f0ff',
                        '--novari-link-card-icon-color': '#cce1ff',
                    }}
                />

                <NovariLinkCard
                    Icon={<Buildings3Icon title="a11y-title" fontSize="1.5rem" />}
                    border
                    description={`Antall organisation: ${organisations.length}`}
                    hover
                    link={'/organisation'}
                    title="Organisasjoner"
                    className="home-link-card"
                    style={{
                        '--novari-link-card-arrow-color': '#0067c5',
                        '--novari-link-card-hover-color': '#e6f0ff',
                        '--novari-link-card-icon-color': '#cce1ff',
                    }}
                />

                <NovariLinkCard
                    Icon={<ComponentIcon title="a11y-title" fontSize="1.5rem" />}
                    border
                    description={`Antall komponents: ${components.length}`}
                    hover
                    link={'/component'}
                    title="Komponenter"
                    className="home-link-card"
                    style={{
                        '--novari-link-card-arrow-color': '#0067c5',
                        '--novari-link-card-hover-color': '#e6f0ff',
                        '--novari-link-card-icon-color': '#cce1ff',
                    }}
                />
                <NovariLinkCard
                    Icon={<WrenchIcon title="a11y-title" fontSize="1.5rem" />}
                    border
                    description={`JSON reporting tools`}
                    hover
                    link={'/tools'}
                    title="Tools"
                    className="home-link-card"
                    style={{
                        '--novari-link-card-arrow-color': '#0067c5',
                        '--novari-link-card-hover-color': '#e6f0ff',
                        '--novari-link-card-icon-color': '#cce1ff',
                    }}
                />

                {/*<CustomLinkPanel*/}
                {/*    key={'contact'}*/}
                {/*    href={'/contact'}*/}
                {/*    title={'Kontakter'}*/}
                {/*    IconComponent={PersonGroupIcon}*/}
                {/*/>*/}

                {/*<CustomLinkPanel*/}
                {/*    key={'organisation'}*/}
                {/*    href={'/organisation'}*/}
                {/*    title={'Organisasjoner'}*/}
                {/*    IconComponent={Buildings3Icon}*/}
                {/*/>*/}
                {/*<CustomLinkPanel*/}
                {/*    key={'component'}*/}
                {/*    href={'/component'}*/}
                {/*    title={'Komponenter'}*/}
                {/*    IconComponent={ComponentIcon}*/}
                {/*/>*/}
                {/*<CustomLinkPanel*/}
                {/*    key={'tools'}*/}
                {/*    href={'/tools'}*/}
                {/*    title={'Tools'}*/}
                {/*    IconComponent={WrenchIcon}*/}
                {/*/>*/}
            </HGrid>
        </>
    );
}
