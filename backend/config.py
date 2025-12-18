import os
from dotenv import load_dotenv

# Load environment variables from .env file
# Try loading from parent directory first (if running from backend folder)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local'))
# Also try loading from current directory just in case
load_dotenv()

class Config:
    # API Keys
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
    GOOGLE_AI_API_KEY = os.getenv("GOOGLE_AI_API_KEY")
    TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
    
    # Supabase
    SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # If needed for admin tasks

    # Provider Selection
    AI_PROVIDER = os.getenv("AI_PROVIDER", "openai") # openai, anthropic, google
    
    # Validation
    @classmethod
    def validate(cls):
        missing = []
        if not cls.OPENAI_API_KEY and cls.AI_PROVIDER == "openai":
            missing.append("OPENAI_API_KEY")
        if not cls.TAVILY_API_KEY:
            # check if web scraping is enabled? For now just warn
            print("Warning: TAVILY_API_KEY is missing. Web scraping might not work.")
        
        if missing:
             print(f"Warning: Missing environment variables: {', '.join(missing)}")

config = Config()
