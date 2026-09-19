import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    ENV: str = "development"
    
    MONGODB_URI: str = "mongodb://localhost:27017"
    DB_NAME: str = "proofly_db"
    
    JWT_SECRET: str = "proofly_jwt_super_secret_key_change_in_production_2026!"
    JWT_REFRESH_SECRET: str = "proofly_jwt_refresh_super_secret_key_2026!"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
    BASE_URL: str = "http://localhost:8000"
    FRONTEND_URL: str = "http://localhost:5173"

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
