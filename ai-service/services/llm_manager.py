import os
import logging
import asyncio
from typing import List, Any, Optional
from langchain_groq import ChatGroq

logger = logging.getLogger("llm_manager")
# Set basic config for logging if not set elsewhere
logging.basicConfig(level=logging.INFO)

class LLMManager:
    def __init__(self):
        self.keys: List[str] = []
        
        # Scan environment variables for GROQ_API_KEY_1, GROQ_API_KEY_2, etc.
        # We check up to 20 keys to support a reasonable amount of sparse or long lists.
        for i in range(1, 21):
            key = os.getenv(f"GROQ_API_KEY_{i}")
            if key and key.strip():
                self.keys.append(key.strip())
        
        # Fall back to standard GROQ_API_KEY if no numbered keys are found
        if not self.keys:
            single_key = os.getenv("GROQ_API_KEY")
            if single_key and single_key.strip():
                self.keys.append(single_key.strip())

        if not self.keys:
            logger.warning("No Groq API keys found in the environment. LLM calls will fail until keys are set.")

        self.current_index = 0
        self.lock = asyncio.Lock()

    async def _get_client(self, key_index: int, **kwargs) -> ChatGroq:
        """Create a ChatGroq client using the API key at key_index."""
        if not self.keys:
            raise ValueError("No Groq API keys configured. Set GROQ_API_KEY_1, GROQ_API_KEY_2, etc. in .env")
        
        api_key = self.keys[key_index]
        
        # Default settings if not explicitly passed
        model_name = kwargs.pop("model_name", "llama-3.3-70b-versatile")
        temperature = kwargs.pop("temperature", 0.7)
        
        return ChatGroq(
            groq_api_key=api_key,
            model_name=model_name,
            temperature=temperature,
            **kwargs
        )

    async def invoke(self, messages: List[Any], response_model: Optional[Any] = None, **kwargs) -> Any:
        """
        Invokes the ChatGroq model with key rotation.
        
        If a rate limit or API error is raised, the manager rotates to the next key
        and retries.
        """
        if not self.keys:
            raise ValueError("No Groq API keys configured. Please check your .env configuration.")

        num_keys = len(self.keys)
        attempts = 0
        
        while attempts < num_keys:
            # Safely fetch the current index
            async with self.lock:
                idx = self.current_index
            
            logger.info(f"Attempting LLM call with key index {idx} (Attempt {attempts + 1}/{num_keys})")
            
            try:
                client = await self._get_client(idx, **kwargs)
                
                # Apply structured output if a Pydantic model is supplied
                if response_model:
                    client = client.with_structured_output(response_model)
                
                response = await client.ainvoke(messages)
                return response
                
            except Exception as e:
                    print(e)
                    raise
            
            if num_keys == 1:
                    # No other keys to try, raise error immediately
                    raise e
                
                # Rotate key index under lock
            async with self.lock:
                    # Only increment if index hasn't been advanced by another concurrent coroutine
                    if self.current_index == idx:
                        self.current_index = (self.current_index + 1) % num_keys
                        logger.info(f"Rotated active key index to {self.current_index}")
                
            attempts += 1

        raise RuntimeError("All configured GROQ API keys failed after rotation retry attempts.")

# Singleton instance for application-wide use
llm_manager = LLMManager()
