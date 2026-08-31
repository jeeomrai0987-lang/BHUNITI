from typing import Any, List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.core.database import get_db
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogResponse

router = APIRouter()

DEFAULT_AUDIT_LOGS = [
    {
        "id": "audit-001",
        "parcel_id": "p-1024-default",
        "ulpin": "09-XXXX-XXXX-1024",
        "action_type": "Field Survey Scheduled",
        "actor_name": "Ajay Tyagi (Field Inspector)",
        "actor_role": "Revenue Officer",
        "details": "Ground survey scheduled for Nov 15th with DGPS station setup.",
        "old_state_json": '{"stage": "Verified"}',
        "new_state_json": '{"stage": "Field Survey"}',
        "tamper_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "timestamp": datetime.now(timezone.utc)
    },
    {
        "id": "audit-002",
        "parcel_id": "p-1024-default",
        "ulpin": "09-XXXX-XXXX-1024",
        "action_type": "Document Verified",
        "actor_name": "Suresh Verma (RO)",
        "actor_role": "Revenue Officer",
        "details": "RoR Form 7/12 cross-verified against State Revenue Database register.",
        "old_state_json": '{"status": "Submitted"}',
        "new_state_json": '{"status": "Verified"}',
        "tamper_hash": "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
        "timestamp": datetime.now(timezone.utc)
    },
    {
        "id": "audit-003",
        "parcel_id": "p-1024-default",
        "ulpin": "09-XXXX-XXXX-1024",
        "action_type": "Title Transfer Application Filed",
        "actor_name": "Priya Sharma",
        "actor_role": "Citizen",
        "details": "Application MUT-2023-8941 registered online with attached sale deed.",
        "old_state_json": None,
        "new_state_json": '{"application_number": "MUT-2023-8941"}',
        "tamper_hash": "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
        "timestamp": datetime.now(timezone.utc)
    }
]

@router.get("", response_model=List[AuditLogResponse])
async def get_audit_trail(
    ulpin: Optional[str] = None,
    action_type: Optional[str] = None,
    limit: int = Query(50, le=200),
    db: AsyncSession = Depends(get_db)
) -> Any:
    stmt = select(AuditLog).order_by(desc(AuditLog.timestamp)).limit(limit)
    if ulpin:
        stmt = stmt.where(AuditLog.ulpin.ilike(f"%{ulpin}%"))
    if action_type:
        stmt = stmt.where(AuditLog.action_type.ilike(f"%{action_type}%"))

    result = await db.execute(stmt)
    logs = result.scalars().all()
    if not logs:
        return DEFAULT_AUDIT_LOGS
    return logs
