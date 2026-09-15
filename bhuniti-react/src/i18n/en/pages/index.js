/*
 * English page catalogs, one module per route.
 *
 * Split per page rather than kept in a handful of big files: the pages are
 * independent, several run past 700 lines of markup, and a per-page module
 * means a translation change touches exactly one small file. The keys below
 * match the camelCase page names used in App.jsx.
 */

import home from "./home.js";
import platform from "./platform.js";
import howItWorks from "./howItWorks.js";
import features from "./features.js";
import governance from "./governance.js";
import about from "./about.js";
import login from "./login.js";
import citizenPortal from "./citizenPortal.js";
import searchRecords from "./searchRecords.js";
import myApplications from "./myApplications.js";
import landServices from "./landServices.js";
import revenueOverview from "./revenueOverview.js";
import gisExplorer from "./gisExplorer.js";
import dataReconciliation from "./dataReconciliation.js";
import mutationManagement from "./mutationManagement.js";
import discrepancyCases from "./discrepancyCases.js";
import historicalTimeline from "./historicalTimeline.js";
import documentsEvidence from "./documentsEvidence.js";
import fieldSurvey from "./fieldSurvey.js";
import reportsAnalytics from "./reportsAnalytics.js";
import auditTrail from "./auditTrail.js";
import adminOverview from "./adminOverview.js";
import districtGis from "./districtGis.js";
import tehsilAnalytics from "./tehsilAnalytics.js";
import reconciliationMonitor from "./reconciliationMonitor.js";
import mutationMonitor from "./mutationMonitor.js";
import officerPerformance from "./officerPerformance.js";
import signup from "./signup.js";
import adminAddOfficer from "./adminAddOfficer.js";

const pages = {
  home,
  platform,
  howItWorks,
  features,
  governance,
  about,
  login,
  signup,
  citizenPortal,
  searchRecords,
  myApplications,
  landServices,
  revenueOverview,
  gisExplorer,
  dataReconciliation,
  mutationManagement,
  discrepancyCases,
  historicalTimeline,
  documentsEvidence,
  fieldSurvey,
  reportsAnalytics,
  auditTrail,
  adminOverview,
  adminAddOfficer,
  districtGis,
  tehsilAnalytics,
  reconciliationMonitor,
  mutationMonitor,
  officerPerformance,
};

export default pages;
