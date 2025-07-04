"""
This file is for AI Agent that provides motivation and stress support to users.
"""


from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field
from typing import Dict, Any
from langchain_core.output_parsers import JsonOutputParser

class ExtractedUserMessageComponent(BaseModel):
    """
    Represents a component of the extracted user message.
    """
    time_range: str = Field(..., description="Time range of the study plan, e.g., 'today', 'this week'.")

class StudyPlanRequest():
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
    
    def process_message(self, user_message, context):
        """
        Process the user message and return a response.
        :param user_message: The message from the user.
        :return: Response from the AI agent.
        """

        llm = self.chat_model

        system_prompt = """
        You are an AI assistant that helps to manage user's assignments, classes, study logs, study plan, and preferences.
        You can analyze deadlines, user's past performance, and suggest a prioritized list of tasks for the day/week based on user input.
        Your response should also be easily readable from a mobile device, so keep it concise and to the point.
        """

        user_prompt = f"""
        User: {user_message}
        Context: {context}
        Please provide a detailed study plan based on the user's message and context.
        """

        # formatted_prompt = prompt_template.format(user_message=user_message)

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ]

        result = llm.invoke(messages)
        text_result = result.content
        print(f"text result: {text_result}")
        return text_result
        
    def extract_user_message (self, user_message: str) -> Dict[str, Any]:
        """
        Extract user message and context from the input.
        :param user_message: The message from the user.
        :return: A dictionary containing the user message and context.
        """
        # Here we can implement any extraction logic if needed
        # time range, ex: today, this week
        # need data from database to give more personalized response
        return {
            "user_message": user_message,
            "context": "No additional context provided."
        }
    
    def get_data_from_database():
        """
        Based on user message, get some data from database to add more context. 
        Input : time range, userid
        Output : data from database
        """
        pass