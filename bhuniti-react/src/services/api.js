// Central API service layer for BHUNITI Land Governance Platform
// Connects React frontend with FastAPI backend (http://127.0.0.1:8000/api/v1)

import { getLocale } from "../i18n/locale-store";
import { logFallback } from "../utils/log";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

/*
 * Every response carries `*_label` fields translated into the locale named by
 * `?lang=`, so the language has to travel with the request rather than being
 * applied afterwards. The backend also reads Accept-Language, but an explicit
 * query parameter survives proxies and is visible in the network tab, which
 * makes a mismatch easy to spot.
 */
function withLocale(endpoint) {
  const [path, query = ""] = endpoint.split("?");
  const params = new URLSearchParams(query);
  if (!params.has("lang")) params.set("lang", getLocale());
  return `${path}?${params.toString()}`;
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("bhuniti_token");
  const headers = {
    "Content-Type": "application/json",
    // Second channel for the same preference: any endpoint that ignores the
    // query parameter still resolves the locale from this header.
    "Accept-Language": getLocale(),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${withLocale(endpoint)}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    // Callers decide what to show; this is dev-only diagnostics.
    logFallback(`API ${endpoint}`, err);
    throw err;
  }
}

export const api = {
  // Authentication & User Profile
  auth: {
    login: async (identifier, password) => {
      const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier, username: identifier, password }),
      });
      if (data.access_token) {
        localStorage.setItem("bhuniti_token", data.access_token);
        localStorage.setItem("bhuniti_user", JSON.stringify(data));
      }
      return data;
    },
    requestOtp: async (identifier, password, claimedRole) => {
      return await request("/auth/request-otp", {
        method: "POST",
        body: JSON.stringify({
          identifier,
          username: identifier,
          password,
          claimed_role: claimedRole,
        }),
      });
    },
    verifyOtp: async (identifier, otp) => {
      const data = await request("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ identifier, username: identifier, otp }),
      });
      if (data.access_token) {
        localStorage.setItem("bhuniti_token", data.access_token);
        localStorage.setItem("bhuniti_user", JSON.stringify(data));
      }
      return data;
    },

    signupStart: async (data) => {
      return await request("/auth/signup/start", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    signupVerifyMobile: async (signupToken, otp) => {
      return await request("/auth/signup/verify-mobile", {
        method: "POST",
        body: JSON.stringify({ signup_token: signupToken, otp }),
      });
    },
    signupAadhaar: async (signupToken, aadhaarNumber) => {
      return await request("/auth/signup/aadhaar", {
        method: "POST",
        body: JSON.stringify({ signup_token: signupToken, aadhaar_number: aadhaarNumber }),
      });
    },
    signupVerifyAadhaar: async (signupToken, otp) => {
      return await request("/auth/signup/verify-aadhaar", {
        method: "POST",
        body: JSON.stringify({ signup_token: signupToken, otp }),
      });
    },
    signupComplete: async (signupToken, username, password, preferredLocale) => {
      const data = await request("/auth/signup/complete", {
        method: "POST",
        body: JSON.stringify({
          signup_token: signupToken,
          username,
          password,
          preferred_locale: preferredLocale || "en",
        }),
      });
      if (data.access_token) {
        localStorage.setItem("bhuniti_token", data.access_token);
        localStorage.setItem("bhuniti_user", JSON.stringify(data));
      }
      return data;
    },
    changePassword: async (currentPassword, newPassword) => {
      const data = await request("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      if (data.access_token) {
        localStorage.setItem("bhuniti_token", data.access_token);
        localStorage.setItem("bhuniti_user", JSON.stringify(data));
      }
      return data;
    },

    logout: () => {
      localStorage.removeItem("bhuniti_token");
      localStorage.removeItem("bhuniti_user");
    },
    getMe: () => request("/auth/me"),
    getCurrentUser: () => {
      try {
        const u = localStorage.getItem("bhuniti_user");
        return u ? JSON.parse(u) : null;
      } catch {
        return null;
      }
    }
  },

  // Administration (District Officer / Admin)
  admin: {
    createOfficer: (data) => request("/admin/officers", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  },

  // Land Parcels & GIS
  parcels: {
    search: (query = "", district = "", tehsil = "") => {
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (district) params.append("district", district);
      if (tehsil) params.append("tehsil", tehsil);
      return request(`/parcels/search?${params.toString()}`);
    },
    getByUlpin: (ulpin) => request(`/parcels/${encodeURIComponent(ulpin)}`),
    getGisAll: (district = "", tehsil = "") => {
      const params = new URLSearchParams();
      if (district) params.append("district", district);
      if (tehsil) params.append("tehsil", tehsil);
      return request(`/parcels/gis/all?${params.toString()}`);
    },
  },

  // Citizen Applications
  applications: {
    getMy: () => request("/applications/my"),
    getById: (id) => request(`/applications/${encodeURIComponent(id)}`),
    create: (data) => request("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    confirmAvailability: (id) => request(`/applications/${encodeURIComponent(id)}/confirm-availability`, {
      method: "POST",
    }),
  },

  // Revenue Officer Mutations
  mutations: {
    list: (status = "") => {
      const q = status ? `?status=${encodeURIComponent(status)}` : "";
      return request(`/mutations${q}`);
    },
    getStats: () => request("/mutations/stats"),
    getById: (id) => request(`/mutations/${encodeURIComponent(id)}`),
    takeAction: (id, action, note = "") => request(`/mutations/${encodeURIComponent(id)}/action`, {
      method: "POST",
      body: JSON.stringify({ action, note }),
    }),
  },

  // Discrepancy Cases
  discrepancies: {
    list: (severity = "", status = "") => {
      const params = new URLSearchParams();
      if (severity) params.append("severity", severity);
      if (status) params.append("status", status);
      return request(`/discrepancies?${params.toString()}`);
    },
    resolve: (id, status = "Resolved", resolution_note = "") => request(`/discrepancies/${encodeURIComponent(id)}/resolve`, {
      method: "POST",
      body: JSON.stringify({ status, resolution_note }),
    }),
  },

  // Field Surveys
  surveys: {
    list: (status = "", ulpin = "") => {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (ulpin) params.append("ulpin", ulpin);
      return request(`/surveys?${params.toString()}`);
    },
    schedule: (data) => request("/surveys", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  },

  // Documents & Evidence
  documents: {
    list: (ulpin = "", docType = "") => {
      const params = new URLSearchParams();
      if (ulpin) params.append("ulpin", ulpin);
      if (docType) params.append("doc_type", docType);
      return request(`/documents?${params.toString()}`);
    },
  },

  // Audit Trail
  audit: {
    list: (ulpin = "", limit = 50) => {
      const params = new URLSearchParams();
      if (ulpin) params.append("ulpin", ulpin);
      params.append("limit", limit.toString());
      return request(`/audit?${params.toString()}`);
    },
  },

  // District & Tehsil Analytics
  analytics: {
    getDistrictOverview: () => request("/analytics/district-overview"),
    getTehsilBreakdown: () => request("/analytics/tehsil-breakdown"),
    getOfficerPerformance: () => request("/analytics/officer-performance"),
  },
};

export default api;
