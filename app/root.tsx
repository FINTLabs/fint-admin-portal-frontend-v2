import {
    isRouteErrorResponse,
    Links,
    type LinksFunction,
    Meta,
    type MetaFunction,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useNavigate,
    useRouteError,
} from 'react-router';
import React from 'react';

import { Alert, Box, Page } from '@navikt/ds-react';
import CustomError from '~/components/errors/CustomError';
import { NovariFooter, NovariHeader } from 'novari-frontend-components';
import MeApi from '~/api/MeApi';
import themeHref from './novari-theme.css?url';
import tailwindHref from './tailwind.css?url';
import akselHref from '@navikt/ds-css?url';
import { normalizePathname } from '~/utils/metricsPath';
import { pageVisits } from '~/routes/metrics';
// Initialize MSW based on environment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let server: any;

// For client-side mocking for tests
if (import.meta.env.DEV && import.meta.env.VITE_MOCK_CYPRESS === 'true') {
    console.log('RUNNING WITH MOCK ENVIRONMENT');
    if (typeof window !== 'undefined') {
        console.log('RUNNING WITH MOCK ENVIRONMENT IN BROWSER');
        // Browser environment
        const { worker } = await import('../cypress/mocks/browsers');
        await worker.start();
        // tell Cypress that MSW is ready
        (window as any).__mswReady = true;
    } else {
        console.log('RUNNING WITH MOCK ENVIRONMENT IN NODE');
        // Node.js environment (server-side)
        const { server: nodeServer } = await import('../cypress/mocks/node');
        server = nodeServer;
        server.listen();
    }
}

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: akselHref },
    { rel: 'stylesheet', href: tailwindHref },
    { rel: 'stylesheet', href: themeHref },
];

export const meta: MetaFunction = () => {
    return [
        { title: 'Novari admin-portal' },
        { name: 'description', content: 'velkommen til adminportalen' },
    ];
};

export const loader = async ({ request }: { request: Request }) => {
    const { pathname } = new URL(request.url);

    // Normalize  for Prometheus labels
    const normalized = normalizePathname(pathname);
    pageVisits.inc({ path: normalized });

    const meResults = await MeApi.getDisplayName();
    if (meResults.success && meResults.data) {
        return new Response(
            JSON.stringify({ success: meResults.success, meData: meResults.data }),
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } else {
        throw new Response('Failed to load Me data', { status: 500 });
    }
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
    const { meData, success } = useLoaderData();
    const navigate = useNavigate();

    return (
        <Page
            footer={
                <Box padding="1" as="footer" background={'surface-alt-3-moderate'}>
                    <NovariFooter links={[]} />
                </Box>
            }>
            <Box background={'bg-default'} as="nav">
                <NovariHeader
                    isLoggedIn={success}
                    appName={'FINT Admin Portal'}
                    menu={[
                        ['Kontakter', '/contact'],
                        ['Organisasjoner', '/organisation'],
                        ['Komponenter', '/component'],
                        ['Tools', '/tools'],
                    ]}
                    showLogoWithTitle={true}
                    displayName={meData?.fullName || 'Logged In'}
                    onLogout={() =>
                        (window.location.href = 'https://idp.felleskomponent.no/nidp/app/logout')
                    }
                    onMenuClick={(action) => navigate(action)}
                />
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

    console.log('ERROR', error);
    if (isRouteErrorResponse(error)) {
        return (
            <Page
                footer={
                    <Box padding="1" as="footer" background={'surface-alt-3-moderate'}>
                        <NovariFooter links={[]} />
                    </Box>
                }>
                <Box as="header" background={'bg-default'}>
                    <NovariHeader
                        isLoggedIn={false}
                        menu={[]}
                        showLogoWithTitle={true}
                        displayName={'Not logged in'}
                    />
                </Box>

                <Box padding="8" paddingBlock="2" as="main">
                    <Page.Block gutters width="lg">
                        <CustomError
                            statusCode={error.status}
                            errorData={error.data}
                            statusTitle={error.statusText}
                        />
                    </Page.Block>
                </Box>
            </Page>
        );
    } else {
        return (
            <Page
                footer={
                    <Box padding="1" as="footer" background={'surface-alt-3-moderate'}>
                        <NovariFooter links={[]} />
                    </Box>
                }>
                <Box as="header" background={'bg-default'}>
                    <NovariHeader
                        isLoggedIn={false}
                        menu={[]}
                        showLogoWithTitle={true}
                        displayName={'Not logged in'}
                    />
                </Box>

                <Box padding="8" paddingBlock="2" as="main">
                    <Page.Block gutters width="lg">
                        <Alert variant="error">Ukjent feil</Alert>
                    </Page.Block>
                </Box>
            </Page>
        );
    }
}

// Clean up MSW server on app shutdown
if (import.meta.env.DEV && typeof window === 'undefined' && server) {
    process.on('SIGINT', () => {
        server.close();
        process.exit();
    });

    process.on('SIGTERM', () => {
        server.close();
        process.exit();
    });
}
