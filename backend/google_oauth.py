from google.auth.transport import requests
from google.oauth2 import id_token
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

# Google OAuth settings
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "your-google-client-id.apps.googleusercontent.com")

class GoogleOAuth:
    @staticmethod
    def verify_google_token(token: str) -> Optional[dict]:
        """Verify Google ID token and return user info"""
        try:
            # Verify the token
            idinfo = id_token.verify_oauth2_token(
                token, requests.Request(), GOOGLE_CLIENT_ID
            )
            
            # Verify the issuer
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')
            
            # Extract user information
            user_info = {
                'google_id': idinfo['sub'],
                'email': idinfo['email'],
                'name': idinfo.get('name', ''),
                'picture': idinfo.get('picture', ''),
                'email_verified': idinfo.get('email_verified', False)
            }
            
            return user_info
            
        except ValueError as e:
            print(f"Token verification failed: {e}")
            return None
        except Exception as e:
            print(f"Error verifying Google token: {e}")
            return None
    
    @staticmethod
    def generate_username_from_email(email: str) -> str:
        """Generate a unique username from email"""
        base_username = email.split('@')[0]
        # Remove any non-alphanumeric characters
        username = ''.join(c for c in base_username if c.isalnum())
        return username[:30]  # Limit length
