
# class Others():
#     pass

import requests
import json

def get_user_data(userid):
    """
    Fetches user data from the API using a POST request.

    Args:
        userid (str): The ID of the user to fetch.

    Returns:
        dict: A dictionary containing the success status and the username
              if successful, or an error message if not.
    """
    try:
        # Define the API endpoint URL
        url = "https://grindhub-production.up.railway.app/api/auth/getUser"

        # Define the headers for the POST request, specifying JSON content
        headers = {'Content-Type': 'application/json'}

        # Create the payload as a Python dictionary
        payload = {'userid': userid}

        # Make the POST request. json.dumps converts the Python dictionary to a JSON string.
        response = requests.post(url, headers=headers, data=json.dumps(payload))

        # Raise an HTTPError for bad responses (4xx or 5xx)
        response.raise_for_status()

        # Parse the JSON response from the API
        data = response.json()

        # Check the 'success' key in the response data
        if data.get('success'):
            # Check if 'existingUser' exists and is not empty
            if data.get('existingUser') and len(data['existingUser']) > 0:
                # Extract the username from the first element of 'existingUser'
                username = data['existingUser'][0].get('username')
                return {"success": True, "username": username}
            else:
                # Handle cases where 'existingUser' is missing or empty despite success=True
                return {"success": False, "message": "No existing user data found in the response."}
        else:
            # If 'success' is false, return the message provided by the API, or a default one
            return {"success": False, "message": data.get('message', 'Operation not successful.')}

    except requests.exceptions.RequestException as e:
        # Catch any request-related errors (e.g., network issues, invalid URL, HTTP errors)
        print(f"Error during API request: {e}")
        return {"success": False, "message": f"Request error: {e}"}
    except json.JSONDecodeError as e:
        # Catch errors if the response body is not valid JSON
        print(f"Error decoding JSON response: {e}")
        return {"success": False, "message": f"JSON parsing error: {e}"}
    except Exception as e:
        # Catch any other unexpected errors
        print(f"An unexpected error occurred: {e}")
        return {"success": False, "message": f"An unexpected error occurred: {e}"}

# Example Usage:
# Replace 'your_user_id_here' with an actual user ID for testing
user_id_to_fetch = "0d3f62b2-35fa-4074-a8e4-1c7681f646de"
result = get_user_data(user_id_to_fetch)

if result["success"]:
    print(f"Successfully retrieved username: {result['username']}")
else:
    print(f"Failed to retrieve user data: {result['message']}")
