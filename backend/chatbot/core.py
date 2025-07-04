"""
File Explanation: core.py

This file will be the core of chatbot feature. This will handle create/find thread based on user email, intent classification,
delegation to specific agent, and sends the message to the user. 

"""
# Library Needed
from langchain_google_genai import GoogleGenerativeAI
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from pydantic import BaseModel, Field
from langchain.chat_models import init_chat_model
from langchain.memory import ChatMessageHistory, ConversationBufferMemory
from langchain.chains import ConversationChain
import requests
import os

import general_information
import greeting_farewell
import motivation_stress_support
import performance_assignment_query
import study_plan_request

class UserIntent(BaseModel):
    """
    This class will define the user intent based on the user message.
    It will be used to classify the intent of the user message.
    """
    user_message: str = Field(..., description="User message to classify intent")
    intent: str = Field(..., description="Intent of the user message")
    thread_id: str = Field(..., description="Thread ID for the conversation")

def get_user_message():
    """
    This function will get the user message from the input.

    Input : User message (string)
    Output: User message (string)
    """
    user_message = input("User: ")
    return user_message

def classify_intent():
    """
    This function will classify the intent of the user message.

    Input : User message (string)
    Output: Intent (string)
    """
    pass

def create_or_find_thread():
    """
    This function will create a new thread or find an existing thread based on user email.

    Input : User email (string)
    Output: Thread ID (string)
    """
    pass

def delegation_to_specific_ai_agent():
    """
    This function will delegate the user message to a specific AI agent based on the intent classification.

    Input : User message (string), Intent (string)
    Output: AI Agent (object)
    """
    pass

def send_message_to_user():
    """
    This function will send the AI agent's response to the user.

    Input : AI Agent response (string)
    Output: None
    """
    pass

def local_test():
    """
    This function is for local testing of the chatbot core functionality.
    It will simulate a conversation with the AI agent.
    """
    pass
    





## GEMINI CODE 
# # Ensure GOOGLE_API_KEY is set
# # In a real application, you'd use a more secure way to manage API keys
# if not os.environ.get("GOOGLE_API_KEY"):
#   os.environ["GOOGLE_API_KEY"] = input("Enter API key for Google Gemini: ")

# # Initialize the chat model
# # Using gemini-2.5-flash for faster responses
# model = init_chat_model("gemini-2.5-flash", model_provider="google_genai")

# # 1. Memory Management: Initialize ChatMessageHistory to store messages
# # This object will hold the entire conversation history, acting as the agent's "memory".
# # Each message (HumanMessage, AIMessage, SystemMessage) is stored sequentially.
# history = ChatMessageHistory()

# # 2. ConversationBufferMemory: Wrap the history in a ConversationBufferMemory
# # ConversationBufferMemory is a type of memory that stores all previous messages
# # and passes them to the LLM. `chat_memory` is where our `ChatMessageHistory`
# # instance is linked. `return_messages=True` ensures the memory returns
# # a list of message objects, which is suitable for chat models.
# memory = ConversationBufferMemory(chat_memory=history, return_messages=True)

# # 3. ConversationChain: Create a conversation chain with the model and memory
# # The ConversationChain is a simple chain that takes the latest input,
# # combines it with the conversation history from `memory`, and passes it to the `llm`.
# # `verbose=True` is very useful for debugging, as it prints out the prompt
# # that is sent to the LLM and the parsed response.
# conversation = ConversationChain(
#     llm=model,
#     memory=memory,
#     verbose=True # Set to True to see the internal workings of the chain
# )

# # Optional: Add an initial system message or AI message to the memory
# # This can help set the persona or initial context for the AI agent
# # before the user even types anything.
# memory.chat_memory.add_message(SystemMessage(content="You are a helpful AI assistant that remembers past conversations. Your goal is to provide concise and relevant answers."))
# memory.chat_memory.add_message(AIMessage(content="Hello! I'm ready to chat. I will remember our conversation as we go along."))

# print("AI Agent: Hello! I'm ready to chat. I will remember our conversation as we go along.")

# # 4. Conversation Loop: Engage in a continuous conversation
# print("Type 'exit' to end the conversation.")
# while True:
#     try:
#         user_input = input("You: ")
#         if user_input.lower() == 'exit':
#             print("AI Agent: Goodbye! It was nice chatting.")
#             break

#         # Predict the AI's response using the conversation chain
#         # When `predict` is called, the ConversationChain automatically:
#         # a) Retrieves the current conversation history from `memory`.
#         # b) Formats the history along with the new `user_input` into a prompt.
#         # c) Sends this prompt to the `llm` (our Gemini model).
#         # d) Receives the LLM's response.
#         # e) Adds both the `user_input` (as HumanMessage) and the LLM's response
#         #    (as AIMessage) to the `memory` (our `history` object).
#         response = conversation.predict(input=user_input)

#         print(f"AI Agent: {response}")

#     except Exception as e:
#         print(f"An error occurred: {e}")
#         print("Please ensure your GOOGLE_API_KEY is correctly set and you have an active internet connection.")
#         break

# print("\n--- Conversation History (Agent's Memory) ---")
# # After the loop exits, we can inspect the full conversation history
# # stored in the `history` object.
# for message in history.messages:
#     # Print each message with its type (Human, AI, System) and content
#     print(f"{message.type.capitalize()}: {message.content}")