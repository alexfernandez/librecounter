import dotenv from 'dotenv'

dotenv.config()
const domainHideList = process.env['BACKEND_DOMAIN_HIDELIST'] || ''
export const domainsToHide = domainHideList.split(',')

