/*
 * The English catalog.
 *
 * `common`     vocabulary shared by every screen (actions, field labels, units)
 * `domain`     labels for values stored in the database -- generated, see
 *              tools/gen_domain_catalog.py
 * `components` the shared chrome in src/components/ (navbars, footers, sidebars)
 * `viewers`    the three heavy interactive widgets: the cadastral map, the 360°
 *              site viewer and the animated counter. Split out from `components`
 *              because between them they carry more copy than the whole chrome.
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
