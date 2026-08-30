from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict
from datetime import datetime

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
    area_ha: float
    area_sqm: Optional[float] = None
    valuation_inr: Optional[float] = None
    boundary_geojson: Optional[str] = None
    centroid_lat: Optional[float] = None
    centroid_lng: Optional[float] = None
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

class ParcelGISResponse(BaseModel):
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
