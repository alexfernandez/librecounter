


export default async function setup(app) {
	app.get('/stats/:site', stats)
}

/**
 * Request: site.
 * Response: {ok}.
 * No auth required.
 */
async function stats() {
	return {ok: true}
}

