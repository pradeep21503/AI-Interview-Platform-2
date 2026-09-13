from langgraph.graph import StateGraph, START, END
from graph.state import InterviewState
from graph.nodes import generate_question_node, generate_feedback_node

# Define and compile the Question Generation Graph
# START -> Generate Question Node -> END
question_builder = StateGraph(InterviewState)
question_builder.add_node("generate_question", generate_question_node)


question_builder.add_edge(
    START,
   "generate_question",
)


question_builder.add_edge(
    "generate_question",
    END,
)

question_graph = question_builder.compile()

# Define and compile the Feedback Evaluation Graph
# START -> Generate Feedback Node -> END
feedback_builder = StateGraph(InterviewState)
feedback_builder.add_node("generate_feedback", generate_feedback_node)
feedback_builder.add_edge(START, "generate_feedback")
feedback_builder.add_edge("generate_feedback", END)

feedback_graph = feedback_builder.compile()
