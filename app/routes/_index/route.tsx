import { HStack } from '@navikt/ds-react';
import { Buildings3Icon, ComponentIcon, PersonGroupIcon, WrenchIcon } from '@navikt/aksel-icons';
import CustomLinkPanel from '~/routes/_index/CustomLinkPanel';

export default function Index() {
    return (
        <HStack gap="3" justify="center" className={'pt-20'}>
            <CustomLinkPanel
                key={'index'}
                href={'/contact'}
                title={'Kontakter'}
                IconComponent={PersonGroupIcon}
                userHasRole={true}
            />

            <CustomLinkPanel
                key={'index'}
                href={'/organisation'}
                title={'Organisasjoner'}
                IconComponent={Buildings3Icon}
                userHasRole={true}
            />
            <CustomLinkPanel
                key={'index'}
                href={'/component'}
                title={'Komponenter'}
                IconComponent={ComponentIcon}
                userHasRole={true}
            />
            <CustomLinkPanel
                key={'index'}
                href={'/tools'}
                title={'Tools'}
                IconComponent={WrenchIcon}
                userHasRole={true}
            />
        </HStack>
    );
}
