import {} from './env.js'

const domainHideList = process.env['BACKEND_DOMAIN_HIDELIST'] || ''
const domainsToHide = domainHideList.split(',')


export function isDomainHidden(domain) {
	if (domainsToHide.includes(domain)) {
		return true
	}
	if (domain.startsWith('localhost:')) {
		return true
	}
	if (domain.startsWith('127.0.0.1')) {
		return true
	}
	return false
}

