import random
import httpx
from graph.dsastate import DsaState,ConversationMessage,CurrentQuestion

from prompts.dsa_prompts import INTRODUCTION_PROMPT,ANALYSIS_PROMPT,TECHNICAL_PROMPT
from services.llm_manager import llm_manager
from schemas.interview  import IntroductionOutput,IntroductionAnalysisOutput,TechnicalOutput
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage


EXPRESS_URL = "http://localhost:8000"

BEGINNER_TOPICS = [
    "Array",
    "String",
    "HashMap",
]

INTERMEDIATE_TOPICS = [
    "Sliding Window",
    "Binary Search",
    "Linked List",
    "Tree",
]

ADVANCED_TOPICS = [
    "Graph",
    "Trie",
    "Heap",
    "Dynamic Programming",
]

def orchestrator_router(state: DsaState):

    if state.stage == "INTRODUCTION":
        return "introduction"

    if state.stage == "TECHNICAL":
        return "technical"

    if state.stage == "FEEDBACK":
        return "feedback"


async def introduction_node(state: DsaState):

    messages = []

    # System Prompt
    messages.append(
        SystemMessage(content=INTRODUCTION_PROMPT)
    )

    # Interview Context
    messages.append(
        SystemMessage(
            content=f"""
Resume:
{state.resume}

Difficulty:
{state.difficulty}

Experience:
{state.experience}
"""
        )
    )

    # Previous Conversation
    for msg in state.conversation:

        if msg.role == "user":
            messages.append(
                HumanMessage(content=msg.message)
            )
        else:
            messages.append(
                AIMessage(content=msg.message)
            )

    result = await llm_manager.invoke(
        messages=messages,
        response_model=IntroductionOutput,
        temperature=0.3,
    )

    state.conversation.append(
        ConversationMessage(
            role="ai",
            message=result.reply,
        )
    )

    if result.completed:
        state.stage = "TECHNICAL"

    return state

async def introduction_analysis_node(state: DsaState):

    messages = [
        SystemMessage(content=ANALYSIS_PROMPT)
    ]

    for msg in state.conversation:

        if msg.role == "user":
            messages.append(
                HumanMessage(content=msg.message)
            )
        else:
            messages.append(
                AIMessage(content=msg.message)
            )

    result = await llm_manager.invoke(
        messages=messages,
        response_model=IntroductionAnalysisOutput,
        temperature=0.2,
    )

    state.candidateProfile.name = result.name
    state.candidateProfile.level = result.level
    state.candidateProfile.summary = result.summary

    return state

async def planner_node(state: DsaState):

    level = state.candidateProfile.level

    if level == "BEGINNER":
        topics = BEGINNER_TOPICS.copy()

    elif level == "INTERMEDIATE":
        topics = INTERMEDIATE_TOPICS.copy()

    else:
        topics = ADVANCED_TOPICS.copy()

    topics = [
        t for t in topics
        if t not in state.askedTopics
    ]

    if not topics:

        if level == "BEGINNER":
            topics = BEGINNER_TOPICS.copy()

        elif level == "INTERMEDIATE":
            topics = INTERMEDIATE_TOPICS.copy()

        else:
            topics = ADVANCED_TOPICS.copy()

    selected_topic = random.choice(topics)

    async with httpx.AsyncClient() as client:

        response = await client.get(
            f"{EXPRESS_URL}/api/internal/question",
            params={
                "topic": selected_topic,
                "difficulty": state.difficulty,
            },
        )

    data = response.json()

    question = data["question"]

    examples_list = []
    if "examples" in question and isinstance(question["examples"], list):
        for ex in question["examples"]:
            examples_list.append(f"Input: {ex.get('input', '')}\nOutput: {ex.get('output', '')}\nExplanation: {ex.get('explanation', '')}")
    else:
        examples_list = [str(question.get("examples", ""))]

    state.currentQuestion = CurrentQuestion(
        id=str(question["_id"]),
        title=question["title"],
        difficulty=question["difficulty"],
        primaryTopic=question["primaryTopic"],
        problemStatement=question.get("problemStatement", ""),
        constraints=question.get("constraints", []),
        examples=examples_list
    )

    state.askedTopics.append(selected_topic)

    return state

async def technical_node(state: DsaState):
    if not state.currentQuestion:
        state.conversation.append(
            ConversationMessage(
                role="ai",
                message="Let's proceed with the coding question. Please wait a moment."
            )
        )
        return state

    messages = []

    constraints_str = "\n".join(state.currentQuestion.constraints) if isinstance(state.currentQuestion.constraints, list) else str(state.currentQuestion.constraints)
    examples_str = "\n\n".join(state.currentQuestion.examples) if isinstance(state.currentQuestion.examples, list) else str(state.currentQuestion.examples)

    system_content = TECHNICAL_PROMPT.format(
        title=state.currentQuestion.title,
        difficulty=state.currentQuestion.difficulty,
        problem_statement=state.currentQuestion.problemStatement,
        constraints=constraints_str,
        examples=examples_str,
        topic_status=state.topicStatus,
        code=state.code,
        stage=state.stage
    )
    messages.append(SystemMessage(content=system_content))

    for msg in state.conversation:
        if msg.role == "user":
            messages.append(HumanMessage(content=msg.message))
        else:
            messages.append(AIMessage(content=msg.message))

    result = await llm_manager.invoke(
        messages=messages,
        response_model=TechnicalOutput,
        temperature=0.3,
    )

    state.conversation.append(
        ConversationMessage(
            role="ai",
            message=result.reply,
        )
    )

    state.topicStatus = result.topicStatus
    state.stage = result.stage

    return state