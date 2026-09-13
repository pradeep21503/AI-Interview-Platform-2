from typing import Literal, List, Optional
from pydantic import BaseModel, Field


class ConversationMessage(BaseModel):
    role: Literal["ai", "user"]
    message: str
class CurrentQuestion(BaseModel):
    id: str
    title: str
    difficulty: str
    primaryTopic: str
    problemStatement: str = ""
    constraints: List[str] = Field(default_factory=list)
    examples: List[str] = Field(default_factory=list)

class CandidateProfile(BaseModel):
    name: str = ""

    level: Literal[
        "BEGINNER",
        "INTERMEDIATE",
        "ADVANCED",
    ] | None = None

    summary: str = ""


class DsaState(BaseModel):
    # Interview Configuration
    difficulty: str
    experience: str
    resume: str = ""

    # Current Interview Stage
    stage: Literal[
        "INTRODUCTION",
        "TECHNICAL",
        "FEEDBACK",
    ]

    # Complete Conversation
    conversation: List[ConversationMessage] = Field(default_factory=list)

    # Candidate Information
    candidateProfile: CandidateProfile = Field(default_factory=CandidateProfile)

    # Current Coding Question
    currentQuestion: CurrentQuestion | None = None

    # Topics Already Asked
    askedTopics: List[str] = Field(default_factory=list)

    # Candidate solution and status
    code: str = ""
    topicStatus: Literal["DISCUSSION", "CODING", "REVIEW"] = "DISCUSSION"