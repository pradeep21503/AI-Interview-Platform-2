import asyncio
import os
import sys
import unittest
from unittest.mock import AsyncMock, patch

# Ensure the root project directory is in the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.llm_manager import LLMManager

class TestLLMManagerRotation(unittest.IsolatedAsyncioTestCase):
    
    @patch("services.llm_manager.ChatGroq")
    async def test_key_rotation_on_failure(self, mock_chat_groq):
        # Setup environment variables for testing key rotation
        with patch.dict(os.environ, {
            "GROQ_API_KEY_1": "key_one",
            "GROQ_API_KEY_2": "key_two"
        }):
            # Initialize a new manager with the mocked environment
            manager = LLMManager()
            self.assertEqual(len(manager.keys), 2)
            self.assertEqual(manager.keys[0], "key_one")
            self.assertEqual(manager.keys[1], "key_two")
            
            # Setup mock clients:
            # First client (key_one) will raise a rate limit error (Exception)
            # Second client (key_two) will succeed and return a mock response
            mock_client_fail = AsyncMock()
            mock_client_fail.ainvoke.side_effect = Exception("Rate limit exceeded")
            
            mock_response = AsyncMock()
            mock_response.content = "This is a response from key two."
            mock_client_success = AsyncMock()
            mock_client_success.ainvoke.return_value = mock_response
            
            # side_effect function for _get_client / ChatGroq instantiation
            # First call (index 0) yields mock_client_fail
            # Second call (index 1) yields mock_client_success
            clients = [mock_client_fail, mock_client_success]
            
            # We mock the _get_client method of our manager to return the respective mock clients
            async def mock_get_client(idx, **kwargs):
                return clients[idx]
                
            manager._get_client = mock_get_client
            
            # Verify current index starts at 0
            self.assertEqual(manager.current_index, 0)
            
            # Invoke LLM call
            response = await manager.invoke([{"role": "user", "content": "hello"}])
            
            # Verify response is from the second client
            self.assertEqual(response.content, "This is a response from key two.")
            # Verify index rotated to 1
            self.assertEqual(manager.current_index, 1)

    @patch("services.llm_manager.ChatGroq")
    async def test_all_keys_fail(self, mock_chat_groq):
        with patch.dict(os.environ, {
            "GROQ_API_KEY_1": "key_one",
            "GROQ_API_KEY_2": "key_two"
        }):
            manager = LLMManager()
            
            # Mock all clients to raise an exception
            mock_client_fail = AsyncMock()
            mock_client_fail.ainvoke.side_effect = Exception("API error")
            
            async def mock_get_client(idx, **kwargs):
                return mock_client_fail
                
            manager._get_client = mock_get_client
            
            # Check that invocation raises RuntimeError when all keys fail
            with self.assertRaises(RuntimeError):
                await manager.invoke([{"role": "user", "content": "hello"}])

if __name__ == "__main__":
    unittest.main()
