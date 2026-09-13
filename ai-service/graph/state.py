from typing import TypedDict, List, Dict, Any, Optional

class InterviewState(TypedDict):
    # Inputs
    resume: str
    difficulty: str
    experience: str
    conversation: List[Dict[str, str]]

     # Decision
    completed: bool
    
    # Outputs
    question: Optional[str]
    feedback: Optional[Dict[str, Any]]
