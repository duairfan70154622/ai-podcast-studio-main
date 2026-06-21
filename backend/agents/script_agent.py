from services.openai_service import call_gpt

def generate_script(research):
    prompt = f"""Turn this into a podcast script:
    {research}
    Make it engaging, conversational, and 2-3 minutes long."""
    return call_gpt(prompt)