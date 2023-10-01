


export default async function setup(app) {
	app.get('/ping', ping)
}

/**
 * Request: no parameters required.
 * Response: {ok}.
 * No auth required.
 */
async function ping() {
	return {ok: true}
}

