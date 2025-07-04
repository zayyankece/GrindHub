"""
This file is for AI Agent that provides motivation and stress support to users.
"""


from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field
from typing import Dict, Any
from langchain_core.output_parsers import JsonOutputParser

class MotivationStressSupport():
    """
    Main class for the Motivation and Stress Support AI Agent.
    """

    def __init__(self, api_key: str):
        """
        Initialize the agent with the API key.
        :param api_key: API key for Google Generative AI.
        """
        self.api_key = api_key
        self.chat_model = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            google_api_key=self.api_key,
            temperature=0.2
        )
        self.parser = JsonOutputParser(pydantic_object=BaseModel)
    
    def process_message(self, user_message):
        """
        Process the user message and return a response.
        :param user_message: The message from the user.
        :return: Response from the AI agent.
        """

        llm = self.chat_model

        system_prompt = """
        You are an AI assistant that provides motivation and stress support to users.
        Users are most likely stressed due to academic pressures, personal issues, or general life challenges.
        You should respond with empathetic and supportive messages that help alleviate stress and provide motivation.
        Your responses should be encouraging and uplifting, focusing on positive reinforcement and practical advice.
        Your response should also be easily readable from a mobile device, so keep it concise and to the point.
        """

        user_prompt = f"""
        User: {user_message}
        Please provide a motivational and supportive response to the user's message.
        """

        # formatted_prompt = prompt_template.format(user_message=user_message)

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ]

        result = llm.invoke(messages)
        text_result = result.content
        print(f"text result: {text_result}")
        