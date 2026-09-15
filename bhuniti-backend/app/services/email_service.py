"""Email delivery service using EmailJS REST API."""
import logging
from typing import Dict, Any
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send"


async def send_otp_email(
    to_email: str,
    to_name: str,
    otp_code: str,
    role: str = "citizen",
    purpose: str = "Login Verification",
) -> bool:
    """Send a 6-digit OTP verification code via EmailJS REST API."""
    if not settings.EMAILJS_SERVICE_ID or not settings.EMAILJS_PUBLIC_KEY:
        logger.warning(
            "EmailJS is not fully configured (missing EMAILJS_SERVICE_ID / EMAILJS_PUBLIC_KEY). "
            "[DEV LOG] OTP for %s (%s) [Role: %s, Purpose: %s]: %s",
            to_name,
            to_email,
            role,
            purpose,
            otp_code,
        )
        return True

    payload: Dict[str, Any] = {
        "service_id": settings.EMAILJS_SERVICE_ID,
        "template_id": settings.EMAILJS_TEMPLATE_ID_OTP,
        "user_id": settings.EMAILJS_PUBLIC_KEY,
        "template_params": {
            "to_email": to_email,
            "to_name": to_name,
            "otp_code": otp_code,
            "role": role,
            "purpose": purpose,
            "expires_minutes": 5 if "Login" in purpose else 30,
        },
    }

    if settings.EMAILJS_PRIVATE_KEY:
        payload["accessToken"] = settings.EMAILJS_PRIVATE_KEY

    headers = {
        "Content-Type": "application/json",
        "Origin": "http://localhost:5173",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                EMAILJS_API_URL,
                json=payload,
                headers=headers,
            )
            if response.status_code == 200:
                logger.info(
                    "OTP email successfully sent to %s via EmailJS for %s",
                    to_email,
                    purpose,
                )
                return True
            else:
                logger.error(
                    "EmailJS error dispatching OTP to %s (%s) for %s: status %s, response: %s",
                    to_name,
                    to_email,
                    purpose,
                    response.status_code,
                    response.text,
                )
                return False
    except Exception as exc:
        logger.error(
            "Failed to dispatch EmailJS OTP request to %s (%s) for %s: %s",
            to_name,
            to_email,
            purpose,
            exc,
            exc_info=True,
        )
        return False


async def send_officer_credentials_email(
    to_email: str,
    to_name: str,
    username: str,
    temp_password: str,
    role: str = "revenue_officer",
) -> bool:
    """Send generated temporary credentials to newly provisioned Officer via EmailJS."""
    template_id = settings.EMAILJS_TEMPLATE_ID_OFFICER_CREDENTIALS or settings.EMAILJS_TEMPLATE_ID_OTP
    if not settings.EMAILJS_SERVICE_ID or not settings.EMAILJS_PUBLIC_KEY:
        logger.warning(
            "EmailJS credentials template in dev mode. Officer account created for %s (%s):\n"
            "  Username: %s\n  Temporary Password: %s\n  Role: %s (Password change required on first login)",
            to_name,
            to_email,
            username,
            temp_password,
            role,
        )
        return True

    payload: Dict[str, Any] = {
        "service_id": settings.EMAILJS_SERVICE_ID,
        "template_id": template_id,
        "user_id": settings.EMAILJS_PUBLIC_KEY,
        "template_params": {
            "to_email": to_email,
            "to_name": to_name,
            "username": username,
            "temp_password": temp_password,
            "role": role,
            "login_url": "http://localhost:5173/login?role=" + role,
        },
    }

    if settings.EMAILJS_PRIVATE_KEY:
        payload["accessToken"] = settings.EMAILJS_PRIVATE_KEY

    headers = {
        "Content-Type": "application/json",
        "Origin": "http://localhost:5173",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                EMAILJS_API_URL,
                json=payload,
                headers=headers,
            )
            if response.status_code == 200:
                logger.info("Officer credentials email successfully sent to %s", to_email)
                return True
            else:
                logger.error("EmailJS credentials error: %s - %s", response.status_code, response.text)
                return False
    except Exception as exc:
        logger.error("Failed to dispatch credentials email: %s", exc)
        return False

