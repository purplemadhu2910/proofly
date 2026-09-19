import re
import secrets
from typing import Dict
from datetime import datetime, timezone

def slugify(text: str) -> str:
    """Converts business name into clean URL slug (e.g. 'Acme Corp!' -> 'acme-corp')"""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    if not text:
        text = f"space-{secrets.token_hex(4)}"
    return text

# In-memory IP rate limiter for public submission
_submission_rate_limit_store: Dict[str, list] = {}

def check_rate_limit(ip_address: str, max_requests: int = 10, window_seconds: int = 60) -> bool:
    now = datetime.now(timezone.utc).timestamp()
    if ip_address not in _submission_rate_limit_store:
        _submission_rate_limit_store[ip_address] = []
    
    # Filter out timestamps outside window
    timestamps = [ts for ts in _submission_rate_limit_store[ip_address] if now - ts < window_seconds]
    if len(timestamps) >= max_requests:
        return False
    
    timestamps.append(now)
    _submission_rate_limit_store[ip_address] = timestamps
    return True

def simulate_send_email(to_email: str, subject: str, body: str):
    """Simulates sending an email notification without requiring a real SMTP server"""
    print(f"\n--- [SIMULATED EMAIL SYSTEM] ---")
    print(f"TO: {to_email}")
    print(f"SUBJECT: {subject}")
    print(f"BODY:\n{body}")
    print(f"--- [END EMAIL] ---\n")
