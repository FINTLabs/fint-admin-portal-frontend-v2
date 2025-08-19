import { ActionFunction, LoaderFunction, useFetcher, useLoaderData } from 'react-router';
import { Box, Pagination, Search } from '@navikt/ds-react';
import { useState } from 'react';
import ComponentsApi from '~/api/ComponentsApi';
import InternalPageHeader from '~/components/InternalPageHeader';
import { ComponentIcon } from '@navikt/aksel-icons';
import ComponentTable from '~/routes/component/ComponentTable';
import ComponentForm from '~/routes/component/ComponentForm';
import logger from '~/components/logger';
import { IComponent } from '~/types/components';
import { ApiResponse, NovariSnackbar, NovariSnackbarItem } from 'novari-frontend-components';
import { useAlerts } from '~/hooks/useAlerts';

export const loader: LoaderFunction = async () => {
    let components: IComponent[] = [];
    const alerts: NovariSnackbarItem[] = [];

    const componentsResult = await ComponentsApi.getComponents();
    console.log('components', componentsResult);
    if (!componentsResult.success) {
        alerts.push({
            id: 'components-load-error',
            variant: componentsResult.variant,
            message: componentsResult.message,
        });
    } else {
        components = componentsResult.data || [];
    }

    if (components.length > 0) {
        components.sort((a, b) => a.name.localeCompare(b.name));
    }

    return Response.json({ components, alerts });
};

export default function ComponentsPage() {
    const { components, alerts } = useLoaderData<{
        components: IComponent[];
        alerts: NovariSnackbarItem[];
    }>();

    const fetcher = useFetcher();
    const actionData = fetcher.data as ApiResponse<IComponent>;
    const { alertState, handleCloseItem } = useAlerts<IComponent>(alerts, actionData);

    const [searchQuery, setSearchQuery] = useState('');
    const filteredComponents = components.filter(
        (component) =>
            component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            component.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedComponents = filteredComponents.slice(startIndex, endIndex);

    const [editing, setEditing] = useState<IComponent | null>(null);
    const [addingNew, setAddingNew] = useState<boolean>(false);

    const breadcrumbs = [{ name: 'Komponenter', link: '/component' }];

    const handleFormSubmit = (formData: FormData) => {
        const actionType = editing ? 'EDIT_COMPONENT' : 'ADD_NEW_COMPONENT';
        formData.append('actionType', actionType);
        fetcher.submit(formData, { method: 'post' });
        setAddingNew(false);
        setEditing(null);
    };

    const handleDelete = (component: IComponent) => {
        const formData = new FormData();
        formData.append('actionType', 'DELETE_COMPONENT');
        formData.append('name', component.name as string);
        fetcher.submit(formData, { method: 'post' });
    };

    return (
        <div>
            <InternalPageHeader
                title={addingNew ? 'Legg til ny komponenter' : 'Komponenter'}
                icon={ComponentIcon}
                breadcrumbs={breadcrumbs}
                onActionButtonClick={!addingNew && !editing ? () => setAddingNew(true) : undefined}
            />

            <NovariSnackbar
                items={alertState}
                position={'top-right'}
                onCloseItem={handleCloseItem}
            />

            {addingNew || editing ? (
                <ComponentForm
                    component={editing}
                    onCancel={() => {
                        setAddingNew(false);
                        setEditing(null);
                    }}
                    handleFormSubmit={handleFormSubmit}
                />
            ) : (
                <>
                    <Box className={'pt-10 w-100 pb-10'}>
                        <Search
                            data-cy="component-search-box"
                            label="Search components"
                            variant="simple"
                            value={searchQuery}
                            onChange={(value: string) => setSearchQuery(value)}
                            size="small"
                        />
                    </Box>

                    <ComponentTable
                        components={paginatedComponents}
                        onEdit={setEditing}
                        onDelete={handleDelete}
                    />
                    {filteredComponents.length > 15 && (
                        <Pagination
                            page={currentPage}
                            onPageChange={(page) => setCurrentPage(page)}
                            count={Math.ceil(filteredComponents.length / itemsPerPage)}
                            size="small"
                            className={'p-3'}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const actionType = formData.get('actionType') as string;

    const newComponent: IComponent = {
        name: formData.get('name') as string,
        basePath: formData.get('basePath') as string,
        description: formData.get('description') as string,
        inPlayWithFint: formData.get('inPlayWithFint') === 'true',
        inBeta: formData.get('inBeta') === 'true',
        inProduction: formData.get('inProduction') === 'true',
        common: formData.get('common') === 'true',
        core: formData.get('core') === 'true',
        openData: formData.get('openData') === 'true',
    };

    //todo: fix logging levels so debug is more than info
    logger.debug(`Received action: ${actionType} in component route`);

    switch (actionType) {
        case 'ADD_NEW_COMPONENT':
            logger.info('Adding new component', newComponent);
            return await ComponentsApi.addComponent(newComponent);

        case 'EDIT_COMPONENT':
            newComponent.dn = formData.get('dn') as string;
            logger.info('Editing component', newComponent);
            return await ComponentsApi.updateComponent(newComponent);

        case 'DELETE_COMPONENT':
            newComponent.dn = formData.get('dn') as string;
            logger.info('Deleting component', newComponent);
            return await ComponentsApi.deleteComponent(newComponent);

        default:
            return {
                success: false,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
    }
};
