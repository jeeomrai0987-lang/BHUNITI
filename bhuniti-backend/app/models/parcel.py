import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, Text, DateTime
from app.core.database import Base

class Parcel(Base):
    __tablename__ = "parcels"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ulpin = Column(String(50), unique=True, index=True, nullable=False)  # e.g., "09-XXXX-XXXX-1024" or "P-1024"
    survey_number = Column(String(50), index=True, nullable=True)
    khasra_number = Column(String(50), index=True, nullable=True)
    khata_number = Column(String(50), nullable=True)
    
    # Location
    state = Column(String(100), default="Uttar Pradesh")
    district = Column(String(100), default="Ghaziabad", index=True)
    tehsil = Column(String(100), default="Modinagar", index=True)
    village = Column(String(100), default="Sikandrabad", index=True)
    pincode = Column(String(10), nullable=True)

    # Ownership & Classification
    owner_name = Column(String(200), nullable=False)
    co_owners_json = Column(Text, nullable=True)  # JSON array of co-owners
    land_type = Column(String(100), default="Agricultural")  # Agricultural, Residential, Commercial, etc.
    area_ha = Column(Float, nullable=False)
    area_sqm = Column(Float, nullable=True)
    valuation_inr = Column(Float, nullable=True)

    # GIS / Geospatial
    boundary_geojson = Column(Text, nullable=True)  # GeoJSON polygon coordinates
    centroid_lat = Column(Float, nullable=True)
    centroid_lng = Column(Float, nullable=True)

    # Status & Flags
    verification_status = Column(String(50), default="Verified")  # Verified, Under Verification, Disputed
    is_disputed = Column(Boolean, default=False)
    dispute_reason = Column(Text, nullable=True)
    encumbrance_status = Column(String(100), default="Clean")  # Clean, Mortgaged, Leased, Court Stay
    image_url = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
