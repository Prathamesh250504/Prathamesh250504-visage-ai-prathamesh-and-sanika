from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, Field

class AnalysisResult(BaseModel):
    """Model for storing facial analysis results"""
    user_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Analysis results
    skin_condition: Dict = Field(default_factory=dict)
    skin_tone: Dict = Field(default_factory=dict)
    skin_type: Dict = Field(default_factory=dict)
    
    # Landmark data
    landmarks: Dict = Field(default_factory=dict)
    face_quality: Dict = Field(default_factory=dict)
    
    # Acne analysis
    acne_analysis: Dict = Field(default_factory=dict)
    
    # Image metadata
    image_angles: List[str] = Field(default_factory=list)
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user123",
                "skin_condition": {
                    "prediction": "Normal",
                    "confidence": 0.95
                },
                "skin_tone": {
                    "prediction": "mid-light",
                    "confidence": 0.88
                },
                "skin_type": {
                    "prediction": "Normal",
                    "confidence": 0.92
                }
            }
        }

class QuizAnswer(BaseModel):
    """Model for storing quiz answers"""
    user_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Quiz answers - matching frontend field names
    skinType: Optional[str] = None  # Changed from skin_type
    gender: Optional[str] = None
    age: Optional[int] = None
    breakouts: Optional[str] = None
    sensitivity: Optional[str] = None
    concern: Optional[str] = None
    waterIntake: Optional[str] = None  # Changed from water_intake
    sleep: Optional[str] = None
    sunscreen: Optional[str] = None
    cleanser: Optional[str] = None
    exfoliate: Optional[str] = None
    
    # Generated analysis
    analysis: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user123",
                "skinType": "Oily",
                "gender": "Female",
                "age": 25,
                "breakouts": "Occasionally",
                "sensitivity": "Mildly sensitive",
                "concern": "Acne",
                "waterIntake": "6-8 glasses",
                "sleep": "7-8 hours",
                "sunscreen": "Every day",
                "cleanser": "Gel",
                "exfoliate": "Once a week",
                "analysis": "Your personalized analysis..."
            }
        }

class User(BaseModel):
    """Model for user data"""
    user_id: str
    email: Optional[str] = None
    name: Optional[str] = None
    birth_date: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    last_analysis: Optional[datetime] = None
    total_analyses: int = 0
    last_quiz: Optional[datetime] = None
    total_quizzes: int = 0
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user123",
                "email": "user@example.com",
                "name": "John Doe",
                "birth_date": "1990-01-01",
                "age": 34,
                "gender": "male"
            }
        }

class AnalysisHistory(BaseModel):
    """Model for tracking analysis history"""
    user_id: str
    analysis_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    summary: Dict = Field(default_factory=dict)
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user123",
                "analysis_id": "analysis456",
                "summary": {
                    "skin_condition": "Normal",
                    "skin_type": "Oily"
                }
            }
        }

class FinalReport(BaseModel):
    """Model for storing combined final reports"""
    user_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Analysis data
    analysis_id: Optional[str] = None
    skin_condition: Optional[Dict] = Field(default_factory=dict)
    skin_tone: Optional[Dict] = Field(default_factory=dict)
    skin_type: Optional[Dict] = Field(default_factory=dict)
    acne_analysis: Optional[Dict] = Field(default_factory=dict)
    
    # Quiz data
    quiz_id: Optional[str] = None
    quiz_answers: Optional[Dict] = Field(default_factory=dict)
    
    # Combined recommendations
    recommendations: Optional[List[str]] = Field(default_factory=list)
    skincare_routine: Optional[Dict] = Field(default_factory=dict)
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user123",
                "analysis_id": "analysis456",
                "quiz_id": "quiz789",
                "skin_condition": {"prediction": "Normal", "confidence": 0.95},
                "recommendations": ["Use SPF daily", "Hydrate well"]
            }
        }

class StreakData(BaseModel):
    """Model for storing user streak data"""
    user_id: str
    date: str  # Format: YYYY-MM-DD
    completed: bool = True
    activity_type: str = "skincare_routine"  # Type of activity completed
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user123",
                "date": "2026-01-29",
                "completed": True,
                "activity_type": "skincare_routine"
            }
        }
