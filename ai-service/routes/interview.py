import logging
from fastapi import APIRouter, HTTPException, status
from schemas.interview import (
    FirstQuestionRequest,
    NextQuestionRequest,
    FeedbackRequest,
    QuestionResponse,
    FeedbackResponse,
    DsaRespondRequest
)
from graph import question_graph, feedback_graph, dsa_graph

logger = logging.getLogger("routes_interview")
router = APIRouter()

@router.post(
    "/generate-first-question",
    response_model=QuestionResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate the first HR interview question based on resume and difficulty"
)
async def generate_first_question(request: FirstQuestionRequest):
    try:
        # Prepare state for the Question Graph
        initial_state = {
            "resume": request.resume,
            "difficulty": request.difficulty,
            "experience": request.experience,
            "conversation": [],
            "question": None,
            "feedback": None,
            "completed": False,
        }
        
        # Invoke the LangGraph compiled question graph
        result = await question_graph.ainvoke(initial_state)
        
        if not result.get("question"):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate a question from the model."
            )
            
        return QuestionResponse( completed= False ,question=result["question"])
        
    except Exception as e:
        logger.error(f"Error in /generate-first-question: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating the first question: {str(e)}"
        )

@router.post(
    "/generate-next-question",
    response_model=QuestionResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate the next HR interview question based on conversation history"
)
async def generate_next_question(request: NextQuestionRequest):
    try:
        # Convert ConversationMessage Pydantic objects to native dictionary items for state
        conversation_list = [
            {"question": msg.question, "answer": msg.answer}
            for msg in request.conversation
        ]
        
        # Prepare state for the Question Graph
        current_state = {
            "resume": request.resume,
            "difficulty": request.difficulty,
            "experience": request.experience,
            "conversation": conversation_list,
            "question": None,
            "feedback": None,
            "completed": False,
        }
        
        # Invoke the LangGraph compiled question graph
        result = await question_graph.ainvoke(current_state)
        
        if result.get("completed") is False and not result.get("question"):
            raise HTTPException(
                status_code=500,
                detail="Failed to generate the next question."
            )
            
        return QuestionResponse(
        completed=result["completed"],
        question=result["question"]
        )
        
    except Exception as e:
        logger.error(f"Error in /generate-next-question: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating the next question: {str(e)}"
        )

@router.post(
    "/generate-feedback",
    response_model=FeedbackResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate final evaluation and feedback based on the full conversation history"
)
async def generate_feedback(request: FeedbackRequest):
    try:
        # Convert ConversationMessage Pydantic objects to native dictionary items for state
        conversation_list = [
            {"question": msg.question, "answer": msg.answer}
            for msg in request.conversation
        ]
        
        # Prepare state for the Feedback Graph
        current_state = {
            "resume": request.resume,
            "difficulty": "",
            "experience": "",
            "conversation": conversation_list,
            "question": None,
            "feedback": None,
            "completed": False,
        }
        
        # Invoke the LangGraph compiled feedback graph
        result = await feedback_graph.ainvoke(current_state)
        
        feedback_data = result.get("feedback")
        if not feedback_data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate feedback evaluation from the model."
            )
            
        return FeedbackResponse(**feedback_data)
        
    except Exception as e:
        logger.error(f"Error in /generate-feedback: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating feedback: {str(e)}"
        )

@router.post(
    "/dsa/respond",
    status_code=status.HTTP_200_OK,
    summary="DSA interview response logic using LangGraph"
)
async def dsa_respond(request: DsaRespondRequest):
    try:
        current_question = None
        if request.currentQuestion:
            current_question = {
                "id": request.currentQuestion.get("id"),
                "title": request.currentQuestion.get("title"),
                "difficulty": request.currentQuestion.get("difficulty"),
                "primaryTopic": request.currentQuestion.get("primaryTopic"),
                "problemStatement": request.currentQuestion.get("problemStatement", ""),
                "constraints": request.currentQuestion.get("constraints", []),
                "examples": request.currentQuestion.get("examples", [])
            }

        level = None
        if request.candidateProfile and request.candidateProfile.get("level"):
            level = request.candidateProfile.get("level")
        candidate_profile = {
            "name": request.candidateProfile.get("name", "") if request.candidateProfile else "",
            "level": level,
            "summary": request.candidateProfile.get("summary", "") if request.candidateProfile else ""
        }

        initial_state = {
            "difficulty": request.difficulty,
            "experience": request.experience,
            "resume": request.resume,
            "stage": request.stage,
            "conversation": [
                {"role": msg.role, "message": msg.message}
                for msg in request.conversation
            ],
            "candidateProfile": candidate_profile,
            "currentQuestion": current_question,
            "askedTopics": request.askedTopics,
            "code": request.code,
            "topicStatus": request.topicStatus
        }

        result = await dsa_graph.ainvoke(initial_state)
        return result

    except Exception as e:
        logger.error(f"Error in /dsa/respond: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred in DSA respond: {str(e)}"
        )
