import { HGrid } from '@navikt/ds-react';
import { Buildings3Icon, ComponentIcon, PersonGroupIcon, WrenchIcon } from '@navikt/aksel-icons';
import CustomLinkPanel from '~/routes/_index/CustomLinkPanel';

export default function Index() {
    return (
        <HGrid columns={2} gap="3" className={'pt-30'}>
            <CustomLinkPanel
                key={'contact'}
                href={'/contact'}
                title={'Kontakter'}
                IconComponent={PersonGroupIcon}
            />

            <CustomLinkPanel
                key={'organisation'}
                href={'/organisation'}
                title={'Organisasjoner'}
                IconComponent={Buildings3Icon}
            />
            <CustomLinkPanel
                key={'component'}
                href={'/component'}
                title={'Komponenter'}
                IconComponent={ComponentIcon}
            />
            <CustomLinkPanel
                key={'tools'}
                href={'/tools'}
                title={'Tools'}
                IconComponent={WrenchIcon}
            />
        </HGrid>
    );
}
