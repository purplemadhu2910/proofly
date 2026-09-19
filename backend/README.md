# Proofly Backend API

Python FastAPI backend for Proofly — Testimonial & Social Proof Collector.

## Setup Instructions

```bash
# Install dependencies
pip install -r requirements.txt

# Run seed script
python seed.py

# Launch development server
python -m uvicorn app.main:app --reload --port 8000
```
Swagger API docs available at `http://localhost:8000/docs`.
