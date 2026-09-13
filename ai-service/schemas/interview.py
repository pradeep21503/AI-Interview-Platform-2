from pydantic import BaseModel, Field
from typing import List, Optional,Literal

class ConversationMessage(BaseModel):
    question: str = Field(description="The question asked by the interviewer")
    answer: str = Field(description="The answer given by the candidate")

class FirstQuestionRequest(BaseModel):
    resume: str = Field(description="Text extracted from candidate resume")
    difficulty: str = Field(description="Difficulty level (e.g. Easy, Medium, Hard)")
    experience: str = Field(description="Experience level (e.g. Fresher, Intermediate, Senior)")

class NextQuestionRequest(BaseModel):
    resume: str = Field(description="Text extracted from candidate resume")
    difficulty: str = Field(description="Difficulty level")
    experience: str = Field(description="Experience level")
    conversation: List[ConversationMessage] = Field(
        default=[],
        description="The sequence of questions and answers in the interview so far"
    )

class FeedbackRequest(BaseModel):
    resume: str = Field(description="Text extracted from candidate resume")
    conversation: List[ConversationMessage] = Field(
        default=[],
        description="The sequence of questions and answers in the interview"
    )

class QuestionResponse(BaseModel):
    completed: bool
    question: Optional[str]  = Field(description="The AI-generated interview question")

class FeedbackResponse(BaseModel):
    overallScore: float = Field(description="Overall evaluation score out of 10")
    communication: float = Field(description="Communication skills score out of 10")
    confidence: float = Field(description="Confidence level score out of 10")
    strengths: List[str] = Field(description="List of candidate's strengths")
    weaknesses: List[str] = Field(description="List of areas of improvement")
    suggestions: List[str] = Field(description="Actionable suggestions for the candidate")
    summary: str = Field(description="Summary of the evaluation")

class IntroductionOutput(BaseModel):
    reply: str =Field(description="The reply you want to give to the user (or) the next questions based on the conversation ")
    completed: bool = Field(description= "keep completed true if you have enough introduction")


class IntroductionAnalysisOutput(BaseModel):
    name: str

    level: Literal[
        "BEGINNER",
        "INTERMEDIATE",
        "ADVANCED",
    ]

    summary: str


class TechnicalOutput(BaseModel):
    reply: str = Field(description="The AI response/reply/question to the candidate")
    topicStatus: Literal["DISCUSSION", "CODING", "REVIEW"] = Field(description="The status of the coding phase")
    stage: Literal["TECHNICAL", "FEEDBACK"] = Field(default="TECHNICAL", description="The stage of the interview")


class DsaConversationMessage(BaseModel):
    role: Literal["ai", "user"]
    message: str


class DsaRespondRequest(BaseModel):
    difficulty: str
    experience: str
    resume: str = ""
    stage: Literal["INTRODUCTION", "TECHNICAL", "FEEDBACK"]
    topicStatus: Literal["DISCUSSION", "CODING", "REVIEW"]
    conversation: List[DsaConversationMessage] = Field(default_factory=list)
    code: str = ""
    currentQuestion: Optional[dict] = None
    askedTopics: List[str] = Field(default_factory=list)
    candidateProfile: Optional[dict] = None