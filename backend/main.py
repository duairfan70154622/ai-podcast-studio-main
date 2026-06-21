from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os

app = FastAPI(title="AI Podcast Studio")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# 🔑 GROQ CLIENT
# -----------------------
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

# -----------------------
# 📦 REQUEST MODEL
# -----------------------
class TopicRequest(BaseModel):
    topic: str

# memory (simple DB)
episodes = []

# -----------------------
# 🎙️ VOICE AGENT (Placeholder)
# -----------------------
def generate_voice(text):
    """Generate voice from script - Placeholder for TTS integration"""
    try:
        # TODO: Add actual TTS logic (e.g., ElevenLabs, Play.ht, etc.)
        print(f"🎙️ Generating voice for script ({len(text)} chars)...")
        
        return {
            "status": "success",
            "audio_url": None,  # Will be populated with actual audio URL
            "duration_seconds": 0,
            "message": "Voice generation placeholder - integrate TTS API here"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Voice generation failed: {str(e)}"
        }

# -----------------------
# 📡 DISTRIBUTION AGENTS (Placeholders)
# -----------------------
def publish_to_buzz(episode):
    """Publish to Buzzsprout - Placeholder"""
    try:
        # TODO: Add Buzzsprout API integration
        print(f"📡 Publishing to Buzzsprout: {episode['topic']}")
        
        return {
            "status": "success",
            "platform": "buzzsprout",
            "episode_id": None,
            "url": None,
            "message": "Buzzsprout publishing placeholder - integrate API here"
        }
    except Exception as e:
        return {
            "status": "error",
            "platform": "buzzsprout",
            "message": f"Buzzsprout publish failed: {str(e)}"
        }

def publish_to_spotify(episode):
    """Publish to Spotify - Placeholder"""
    try:
        # TODO: Add Spotify API integration
        print(f"📡 Publishing to Spotify: {episode['topic']}")
        
        return {
            "status": "success",
            "platform": "spotify",
            "episode_id": None,
            "url": None,
            "message": "Spotify publishing placeholder - integrate API here"
        }
    except Exception as e:
        return {
            "status": "error",
            "platform": "spotify",
            "message": f"Spotify publish failed: {str(e)}"
        }

# -----------------------
# 🧠 RESEARCH AGENT
# -----------------------
def research_topic(topic: str):
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": f"Give a short, clear podcast research summary about {topic}"
                }
            ]
        )
        return response.choices[0].message.content

    except Exception as e:
        return f"Research failed: {str(e)}"

# -----------------------
# ✍️ SCRIPT AGENT
# -----------------------
def generate_script(research: str):
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": f"Turn this into a podcast script:\n{research}\nMake it engaging and conversational."
                }
            ]
        )
        return response.choices[0].message.content

    except Exception as e:
        return f"Script failed: {str(e)}"

# -----------------------
# 🎙️ MAIN PIPELINE
# -----------------------
@app.post("/generate")
def generate_podcast(req: TopicRequest):
    try:
        # 1. Research
        research = research_topic(req.topic)

        # 2. Script
        script = generate_script(research)

        # 3. Voice
        audio = generate_voice(script)

        # 4. Episode object
        episode = {
            "topic": req.topic,
            "research": research,
            "script": script,
            "audio": audio
        }

        # 5. Distribution layer (Buzz + Spotify mock)
        episode["buzz"] = publish_to_buzz(episode)
        episode["spotify"] = publish_to_spotify(episode)

        # save
        episodes.append(episode)

        return {
            "status": "success",
            "episode": episode
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": f"Pipeline failed: {str(e)}"
        }

# -----------------------
# 📦 GET ALL EPISODES
# -----------------------
@app.get("/episodes")
def get_episodes():
    return {
        "total": len(episodes),
        "episodes": episodes
    }

# -----------------------
# 🏥 HEALTH CHECK
# -----------------------
@app.get("/")
def root():
    return {
        "app": "AI Podcast Studio",
        "status": "running",
        "endpoints": {
            "generate": "/generate (POST)",
            "episodes": "/episodes (GET)",
            "health": "/ (GET)"
        }
    }
