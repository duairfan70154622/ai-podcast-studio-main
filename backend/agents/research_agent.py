from client import client

def research_topic(topic: str):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": f"Give a podcast research summary about {topic}"
            }
        ]
    )
    return response.choices[0].message.content
