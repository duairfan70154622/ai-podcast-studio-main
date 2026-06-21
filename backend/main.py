from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os

from agents.voice_agent import generate_voice
from agents.distribution_agent import publish_to_buzz, publish_to_spotify
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


# -----------------------
# 📦 GET ALL EPISODES
# -----------------------
@app.get("/episodes")
def get_episodes():
    return {
        "total": len(episodes),
        "episodes": episodes
    }
