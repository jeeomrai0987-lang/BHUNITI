from fastapi import APIRouter

from app.api.v1.endpoints import (
    analytics,
    applications,
    audit,
    auth,
    discrepancies,
    documents,
    encumbrances,
    i18n,
    mutations,
    notifications,
    parcels,
    registrations,
    surveys,
    users,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(parcels.router, prefix="/parcels", tags=["Land Parcels & GIS"])
api_router.include_router(applications.router, prefix="/applications", tags=["Citizen Applications"])
api_router.include_router(mutations.router, prefix="/mutations", tags=["Mutation Management"])
api_router.include_router(discrepancies.router, prefix="/discrepancies", tags=["Discrepancy Cases"])
api_router.include_router(surveys.router, prefix="/surveys", tags=["Field Surveys"])
api_router.include_router(documents.router, prefix="/documents", tags=["Documents & Evidence"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(registrations.router, prefix="/registrations", tags=["Land Deed Registrations"])
api_router.include_router(encumbrances.router, prefix="/encumbrances", tags=["Encumbrances & Liens"])
api_router.include_router(audit.router, prefix="/audit", tags=["Audit Trail"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["District & Tehsil Analytics"])
api_router.include_router(users.router, prefix="/users", tags=["User Administration"])
api_router.include_router(i18n.router, prefix="/i18n", tags=["Languages"])
