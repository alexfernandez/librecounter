import {promises as fs} from 'fs'

const filesByPath = new Map()


class File {
	constructor(path, mime) {
		this.path = path
		this.mime = mime
		this.contents = null
		this.lastModified = 0
	}

	async readContents() {
		try {
			const stats = await fs.stat(this.path)
			if (!this.contents) {
				this.lastModified = stats.mtimeMs
				this.contents = await fs.readFile(this.path)
			}
			const since = stats.mtimeMs
			if (since > this.lastModified) {
				console.log(`Reloading ${this.path}`)
				this.contents = await fs.readFile(this.path)
				this.lastModified = since
			}
			return this.contents
		} catch(exception) {
			if (exception.code != 'ENOENT') {
				console.error(`Error accessing ${this.path}: ${JSON.stringify(exception)}`)
			}
			return null
		}
	}
}

export async function serveStaticFile(path, mime, request, reply) {
	if (!filesByPath.has(path)) {
		filesByPath.set(path, new File(path, mime))
	}
	const file = filesByPath.get(path)
	const contents = await file.readContents()
	if (!contents) {
		reply.status(404)
		return {error:"File not found"}
	}
	reply.type(file.mime)
	return contents
}

