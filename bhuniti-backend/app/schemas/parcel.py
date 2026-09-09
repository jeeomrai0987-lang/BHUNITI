from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field


class ParcelBase(BaseModel):
    ulpin: str
    survey_number: Optional[str] = None
    khasra_number: Optional[str] = None
    khata_number: Optional[str] = None
    state: str = "Uttar Pradesh"
    district: str = "Ghaziabad"
    tehsil: str = "Modinagar"
    village: str = "Sikandrabad"
    pincode: Optional[str] = None
    owner_name: str
    co_owners_json: Optional[str] = None
    land_type: str = "Agricultural"
    area_ha: float = Field(ge=0)
    area_sqm: Optional[float] = Field(default=None, ge=0)
    valuation_inr: Optional[float] = Field(default=None, ge=0)
    boundary_geojson: Optional[str] = None
    centroid_lat: Optional[float] = Field(default=None, ge=-90, le=90)
    centroid_lng: Optional[float] = Field(default=None, ge=-180, le=180)
    verification_status: str = "Verified"
    is_disputed: bool = False
    dispute_reason: Optional[str] = None
    encumbrance_status: str = "Clean"
    image_url: Optional[str] = None


class ParcelCreate(ParcelBase):
    pass


class ParcelResponse(ParcelBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime

    # Translated siblings for the values stored in English.
    land_type_label: Optional[str] = None
    verification_status_label: Optional[str] = None
    encumbrance_status_label: Optional[str] = None


class ParcelGISResponse(BaseModel):
    """Trimmed payload for the map layers.

    ``boundary_geojson`` is already-parsed JSON here (the column stores text),
    so Leaflet can consume it without a second ``JSON.parse``.
    """

    id: str
    ulpin: str
    owner_name: str
    area_ha: float
    land_type: str
    verification_status: str
    is_disputed: bool
    centroid_lat: Optional[float] = None
    centroid_lng: Optional[float] = None
    boundary_geojson: Optional[Any] = None
    tehsil: str
    village: str

    land_type_label: Optional[str] = None
    verification_status_label: Optional[str] = None
