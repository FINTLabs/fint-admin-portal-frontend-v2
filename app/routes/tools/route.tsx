import { useFetcher, ActionFunction } from 'react-router';
import { Button, Heading, HGrid, Loader, VStack } from '@navikt/ds-react';
import { Buildings3Icon, ComponentIcon, PersonGroupIcon, WrenchIcon } from '@navikt/aksel-icons';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/acai.css';
import MaintenanceApi from '~/api/MaintenanceApi';
import InternalPageHeader from '~/components/InternalPageHeader';

interface FetcherData {
    reportType: string;
    data: never;
}

export default function ToolsPage() {
    const fetcher = useFetcher<FetcherData>();

    const isLoading = fetcher.state === 'submitting' || fetcher.state === 'loading';
    const breadcrumbs = [{ name: 'Tools', link: '/tools' }];

    return (
        <>
            <InternalPageHeader
                title={'Tools'}
                icon={WrenchIcon}
                breadcrumbs={breadcrumbs}
                // onActionButtonClick={
                //     !addingNew && !editingOrg ? () => setAddingNew(true) : undefined
                // }
            />

            <VStack gap="4">
                <fetcher.Form method="post">
                    <HGrid gap="6" columns={5}>
                        <Button
                            type="submit"
                            name="reportType"
                            value="Organisasjoner"
                            icon={<Buildings3Icon aria-hidden />}
                            size="small">
                            Organizations
                        </Button>
                        <Button
                            type="submit"
                            name="reportType"
                            value="Adapter"
                            icon={<ComponentIcon aria-hidden />}
                            size="small">
                            Adapter
                        </Button>
                        <Button
                            type="submit"
                            name="reportType"
                            value="Client"
                            icon={<PersonGroupIcon aria-hidden />}
                            size="small">
                            Client
                        </Button>
                        <Button
                            type="submit"
                            name="reportType"
                            value="Legal"
                            icon={<PersonGroupIcon aria-hidden />}
                            size="small">
                            Legal
                        </Button>
                        <Button
                            type="submit"
                            name="reportType"
                            value="Technical"
                            icon={<PersonGroupIcon aria-hidden />}
                            size="small">
                            Technical
                        </Button>
                    </HGrid>
                </fetcher.Form>

                {isLoading ? (
                    <Loader size="3xlarge" title="Venter..." variant="interaction" />
                ) : fetcher.data ? (
                    <>
                        {/*<Heading size="large">{fetcher.data.reportType}</Heading>*/}
                        <JSONPretty id="json-pretty" data={fetcher.data} />
                    </>
                ) : (
                    <Heading size="large">Please choose a report to run</Heading>
                )}
            </VStack>
        </>
    );
}

export const action: ActionFunction = async ({ request }: { request: Request }) => {
    const formData = await request.formData();
    const reportType = formData.get('reportType');

    let data;
    switch (reportType) {
        case 'Organizations':
            data = await MaintenanceApi.getOrganisationConsistency();
            break;
        case 'Adapter':
            data = await MaintenanceApi.getAdapterConsistency();
            break;
        case 'Client':
            data = await MaintenanceApi.getClientConsistency();
            break;
        case 'Legal':
            data = await MaintenanceApi.getLegalConsistency();
            break;
        case 'Technical':
            data = await MaintenanceApi.getTechnicalConsistency();
            break;
        default:
            console.info('Unknown report type');
            data = null;
    }

    return Response.json({ data, reportType });
};
