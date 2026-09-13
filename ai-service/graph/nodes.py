import logging
from typing import Dict, Any, List
from langchain_core.messages import SystemMessage, HumanMessage
from graph.state import InterviewState
from prompts.hr_prompts import (
    FIRST_QUESTION_SYSTEM_PROMPT,
    FIRST_QUESTION_USER_TEMPLATE,
    NEXT_QUESTION_SYSTEM_PROMPT,
    NEXT_QUESTION_USER_TEMPLATE,
    FEEDBACK_SYSTEM_PROMPT,
    FEEDBACK_USER_TEMPLATE
)
from services.llm_manager import llm_manager
from schemas.interview import FeedbackResponse,QuestionResponse

logger = logging.getLogger("graph_nodes")

def format_conversation(conversation: List[Dict[str, str]]) -> str:
    """Format the conversation list into Interviewer/Candidate dialogues."""
    if not conversation:
        return "No conversation history yet."
    formatted = []
    for msg in conversation:
        q = msg.get("question", "").strip()
        a = msg.get("answer", "").strip()
        formatted.append(f"Interviewer: {q}\nCandidate: {a}")
    return "\n\n".join(formatted)

async def generate_question_node(state: InterviewState) -> Dict[str, Any]:
    conversation = state.get("conversation", [])

    if not conversation:
        logger.info("Generating the first interview question.")

        system_prompt = FIRST_QUESTION_SYSTEM_PROMPT
        user_prompt = FIRST_QUESTION_USER_TEMPLATE.format(
            resume=state.get("resume", ""),
            experience=state.get("experience", ""),
            difficulty=state.get("difficulty", "")
        )

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ]

        # No structured output for the first question
        response = await llm_manager.invoke(messages)

        question = response.content.strip()

        return {
            "completed": False,
            "question": question
        }

    # ---------------- NEXT QUESTIONS ---------------- #

    logger.info(
        f"Generating the next interview question. Current turn: {len(conversation)+1}"
    )

    formatted_conv = format_conversation(conversation)

    system_prompt = NEXT_QUESTION_SYSTEM_PROMPT
    user_prompt = NEXT_QUESTION_USER_TEMPLATE.format(
        resume=state.get("resume", ""),
        conversation=formatted_conv,
        difficulty=state.get("difficulty", ""),
        experience=state.get("experience", "")
    )

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt)
    ]

    response = await llm_manager.invoke(
        messages,
        response_model=QuestionResponse
    )

    print(response)

    return {
        "completed": response.completed,
        "question": response.question
    }
    """Node that decides whether to generate the first or next question."""
    conversation = state.get("conversation", [])
    
    if not conversation:
        logger.info("Generating the first interview question.")
        system_prompt = FIRST_QUESTION_SYSTEM_PROMPT
        user_prompt = FIRST_QUESTION_USER_TEMPLATE.format(
            resume=state.get("resume", ""),
            experience=state.get("experience", ""),
            difficulty=state.get("difficulty", "")
        )
    else:
        logger.info(f"Generating the next interview question. Current turn: {len(conversation) + 1}")
        system_prompt = NEXT_QUESTION_SYSTEM_PROMPT
        formatted_conv = format_conversation(conversation)
        user_prompt = NEXT_QUESTION_USER_TEMPLATE.format(
            resume=state.get("resume", ""),
            conversation=formatted_conv,
            difficulty=state.get("difficulty", ""),
            experience=state.get("experience", "")
        )

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt)
    ]
    
    response = await llm_manager.invoke(
    messages,
    response_model=QuestionResponse
)
    print(response)
    return {
    "completed": response.completed,
    "question": response.question
}

async def generate_feedback_node(state: InterviewState) -> Dict[str, Any]:
    """Node that evaluates the complete interview conversation and returns structured feedback."""
    logger.info("Evaluating complete HR interview and generating structured feedback.")
    conversation = state.get("conversation", [])
    formatted_conv = format_conversation(conversation)
    
    system_prompt = FEEDBACK_SYSTEM_PROMPT
    user_prompt = FEEDBACK_USER_TEMPLATE.format(
        resume=state.get("resume", ""),
        conversation=formatted_conv
    )
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt)
    ]
    
    # Request structured output using the Pydantic schema
    response = await llm_manager.invoke(messages, response_model=FeedbackResponse)
    
    if hasattr(response, "model_dump"):
        feedback_dict = response.model_dump()
    elif hasattr(response, "dict"):
        feedback_dict = response.dict()
    else:
        feedback_dict = response
        
    return {"feedback": feedback_dict}

