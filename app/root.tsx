import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useRouteError,
} from '@remix-run/react';

import './tailwind.css';
import '@navikt/ds-css';
import './novari-theme.css';
import { Alert, Box, Page } from '@navikt/ds-react';
import { CustomErrorLayout } from '~/components/errors/CustomErrorLayout';
import CustomError from '~/components/errors/CustomError';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import { type MetaFunction } from '@remix-run/node';
import MeApi from '~/api/MeApi';
import logger from '~/components/logger';

export const loader = async () => {
    try {
        const apiResponse = await MeApi.getDisplayName();
        const meData = apiResponse.data || [];

        if ('fullName' in meData) {
            logger.debug(`Me response ${meData}`);
        }

        return new Response(JSON.stringify({ meData }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch {
        throw new Response('Failed to load Me data', { status: 500 });
    }
};

export const meta: MetaFunction = () => {
    return [
        { title: 'Novari admin-portal' },
        { name: 'description', content: 'velkommen til adminportalen' },
    ];
};
export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <Meta />
                <Links />
            </head>
            <body data-theme="novari">
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return (
        <Page
            footer={
                <Box padding="1" as="footer" className={'novari-footer'}>
                    <Page.Block gutters width="lg">
                        <Footer />
                    </Page.Block>
                </Box>
            }>
            <Box as="header" className={'novari-header'}>
                <Page.Block gutters width="lg" className={'pt-2 pb-2'}>
                    <Header />
                </Page.Block>
            </Box>

            <Box padding="8" paddingBlock="2" as="main">
                <Page.Block gutters width="lg">
                    <Outlet />
                </Page.Block>
            </Box>
        </Page>
    );
}
export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <CustomErrorLayout>
                <CustomError
                    statusCode={error.status}
                    errorData={error.data}
                    statusTitle={error.statusText}
                />
            </CustomErrorLayout>
        );
    } else {
        return (
            <CustomErrorLayout>
                <Alert variant="error">Ukjent feil</Alert>
            </CustomErrorLayout>
        );
    }
}
