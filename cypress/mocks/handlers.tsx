import { http, HttpResponse } from 'msw';

// Helper function to load JSON data that works in both browser and Node environments
async function loadJson(path: string, fallback: any) {
    console.log('MSW MOCKING:', path);
    try {
        // Use dynamic import instead of require
        const module = await import(/* @vite-ignore */ path);
        return module.default;
    } catch (e) {
        return fallback;
    }
}

export const handlers = [
    // User endpoint
    http.get('*/api/me', async () => {
        return HttpResponse.json(await loadJson('../fixtures/me.json', null));
    }),

    // Organisation endpoints
    http.get('*/api/organisations', async () => {
        return HttpResponse.json(await loadJson('../fixtures/organisations.json', null));
    }),

    http.post('*/api/organisations', async ({ request }) => {
        console.log('MSW MOCKING ORGS POST:', request.url);
        return HttpResponse.json({
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }),

    http.put('*/api/organisations/:name', async () => {
        return HttpResponse.json(await loadJson('../fixtures/organisations.json', null));
    }),

    // Components endpoints
    http.get('*/api/components', async () => {
        return HttpResponse.json(await loadJson('../fixtures/components.json', null));
    }),
    // used to test an error from server
    // http.get('*/api/components', async () => {
    //     return new HttpResponse(null, {
    //         status: 500,
    //         statusText: 'Server Error',
    //     });
    // }),

    http.post('*/api/components', async ({ request }) => {
        console.log('MSW MOCKING COMPONENTS POST:', request.url);
        return HttpResponse.json({
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }),
    http.put('*/api/components/:name', async () => {
        return HttpResponse.json(await loadJson('../fixtures/components.json', null));
    }),

    // Contacts endpoints
    http.get('*/api/contacts', async ({ request }) => {
        console.log('MSW MOCKING CONTACTS GET:', request.url);
        return HttpResponse.json(await loadJson('../fixtures/contacts.json', null));
    }),

    http.post('*/api/contacts', async ({ request }) => {
        console.log('MSW MOCKING CONTACTS POST:', request.url);
        return HttpResponse.json({
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }),

    // Maintenance/consistency endpoints
    http.get('*/api/maintenance/consistency/:endpoint', async ({ params }) => {
        return HttpResponse.json(
            await loadJson(`../fixtures/consistency-${params.endpoint}.json`, null)
        );
    }),
];
