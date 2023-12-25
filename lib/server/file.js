import {promises as fs} from 'fs'

const filesByPath = new Map()


export class File {
	constructor(path, mime) {
		this.path = path
		this.mime = mime
		this.contents = null
		this.lastModified = 0
	}

	async readContents() {
		if (!this.contents) {
			this.contents = await fs.readFile(this.path)
			this.lastModified = (await fs.stat(this.path)).mtimeMs
		}
		const since = (await fs.stat(this.path)).mtimeMs
		if (since > this.lastModified) {
			console.log(`Reloading ${this.path}`)
			this.contents = await fs.readFile(this.path)
			this.lastModified = since
		}
		return this.contents
	}
}

export async function serveStaticFile(path, mime, request, reply) {
	if (!filesByPath.has(path)) {
		filesByPath.set(path, new File(path, mime))
	}
	const file = filesByPath.get(path)
	const contents = await file.readContents()
	reply.type(file.mime)
	return contents
}

