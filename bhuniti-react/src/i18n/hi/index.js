/*
 * The Hindi catalog. Mirrors ../en/index.js key for key; the checker in
 * tools/check_i18n.mjs fails the build if the two ever drift apart.
 *
 * `common`     vocabulary shared by every screen (actions, field labels, units)
 * `domain`     labels for values stored in the database -- generated, see
 *              tools/gen_domain_catalog.py
 * `components` the shared chrome in src/components/ (navbars, footers, sidebars)
 * `viewers`    the cadastral map, the 360° site viewer and the counter
 * `pages`      one module per route, see ./pages/index.js
 */

import common from "./common.js";
import components from "./components.js";
import domain from "./domain.js";
import pages from "./pages/index.js";
import viewers from "./viewers.js";

export default {
  common,
  components,
  domain,
  pages,
  viewers,
};
