import PackageData from '../package.json?raw'
const parsed_data = JSON.parse(PackageData)
export const BLOCKLY_API_VERSION = 1
export const BLOCKLY_VERSION = parsed_data.version ?? '0.0.0'
