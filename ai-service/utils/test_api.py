import os
import sys
import unittest
from unittest.mock import AsyncMock, patch

# Ensure the root project directory is in the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app import app
from schemas.interview import FeedbackResponse

class TestInterviewAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_check(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "healthy", "service": "ai-reasoning-service"})

    @patch("services.llm_manager.llm_manager.invoke")
    def test_generate_first_question(self, mock_invoke):
        # Mock the async invoke response
        mock_response = AsyncMock()
        mock_response.content = "What are your professional goals for the next five years?"
        mock_invoke.return_value = mock_response

        payload = {
            "resume": "Experienced Software Engineer with 5 years in Python.",
            "difficulty": "Medium",
            "experience": "Fresher"
        }

        response = self.client.post("/generate-first-question", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("question", data)
        self.assertEqual(data["question"], "What are your professional goals for the next five years?")
        
        # Verify the LLM manager was invoked
        mock_invoke.assert_called_once()

    @patch("services.llm_manager.llm_manager.invoke")
    def test_generate_next_question(self, mock_invoke):
        # Mock the async invoke response
        mock_response = AsyncMock()
        mock_response.content = "Can you describe a time when you resolved a team conflict?"
        mock_invoke.return_value = mock_response

        payload = {
            "resume": "Experienced Software Engineer with 5 years in Python.",
            "difficulty": "Medium",
            "experience": "Intermediate",
            "conversation": [
                {
                    "question": "What are your professional goals for the next five years?",
                    "answer": "I want to lead engineering teams and build scalable products."
                }
            ]
        }

        response = self.client.post("/generate-next-question", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("question", data)
        self.assertEqual(data["question"], "Can you describe a time when you resolved a team conflict?")
        mock_invoke.assert_called_once()

    @patch("services.llm_manager.llm_manager.invoke")
    def test_generate_feedback(self, mock_invoke):
        # Mock the structured feedback response
        mock_feedback = FeedbackResponse(
            overallScore=8.5,
            communication=9.0,
            confidence=8.0,
            strengths=["Clear articulation", "Strong python foundation"],
            weaknesses=["Needs to slow down during explanations"],
            suggestions=["Practice pausing before answering"],
            summary="Overall, candidate demonstrates solid technical foundation and clear communication skills."
        )
        
        # Since response_model is passed to LLMManager, the return value is directly the Pydantic model
        mock_invoke.return_value = mock_feedback

        payload = {
            "resume": "Experienced Software Engineer with 5 years in Python.",
            "conversation": [
                {
                    "question": "What are your professional goals for the next five years?",
                    "answer": "I want to lead engineering teams and build scalable products."
                },
                {
                    "question": "Can you describe a time when you resolved a team conflict?",
                    "answer": "I organized a structured design review session to resolve technical disagreement align on facts."
                }
            ]
        }

        response = self.client.post("/generate-feedback", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verify JSON outputs match feedback schema
        self.assertEqual(data["overallScore"], 8.5)
        self.assertEqual(data["communication"], 9.0)
        self.assertEqual(data["confidence"], 8.0)
        self.assertEqual(data["strengths"], ["Clear articulation", "Strong python foundation"])
        self.assertEqual(data["weaknesses"], ["Needs to slow down during explanations"])
        self.assertEqual(data["suggestions"], ["Practice pausing before answering"])
        self.assertEqual(data["summary"], "Overall, candidate demonstrates solid technical foundation and clear communication skills.")
        
        mock_invoke.assert_called_once()

if __name__ == "__main__":
    unittest.main()
