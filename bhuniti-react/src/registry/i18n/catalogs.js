import en from './en/index.js'
import hi from './hi/index.js'

/**
 * Every user-visible string in the app lives under one of these two trees.
 * The shapes are kept identical on purpose — tools/check_catalogs.mjs fails
 * the build if a key exists in one locale but not the other.
 */
const CATALOGS = { en, hi }

export default CATALOGS
