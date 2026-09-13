from langgraph.graph import StateGraph, START, END
from graph.dsastate import DsaState
from graph.dsanodes import introduction_node, introduction_analysis_node, planner_node, technical_node, orchestrator_router

builder = StateGraph(DsaState)

builder.add_node("introduction", introduction_node)
builder.add_node("introduction_analysis", introduction_analysis_node)
builder.add_node("planner", planner_node)
builder.add_node("technical", technical_node)

builder.add_conditional_edges(
    START,
    orchestrator_router,
    {
        "introduction": "introduction",
        "technical": "technical",
        "feedback": END
    }
)

def post_intro_router(state: DsaState):
    if state.stage == "TECHNICAL":
        return "analyze_and_plan"
    return "end"

builder.add_conditional_edges(
    "introduction",
    post_intro_router,
    {
        "analyze_and_plan": "introduction_analysis",
        "end": END
    }
)

builder.add_edge("introduction_analysis", "planner")
builder.add_edge("planner", END)
builder.add_edge("technical", END)

dsa_graph = builder.compile()
