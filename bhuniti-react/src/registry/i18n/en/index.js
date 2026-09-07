import common from './common.js'
import chrome from './chrome.js'
import map from './map.js'
import parcel from './pages/parcel.js'
import owner from './pages/owner.js'
import transaction from './pages/transaction.js'
import review from './pages/review.js'
import tracking from './pages/tracking.js'

/** English catalog. `hi/index.js` must mirror this shape exactly. */
export default {
  ...common,
  ...chrome,
  map,
  pages: { parcel, owner, transaction, review, tracking },
}
