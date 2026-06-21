def publish_to_buzz(episode: dict):
    return {
        "status": "buzzed",
        "message": f"Episode '{episode['topic']}' promoted via Buzz system"
    }


def publish_to_spotify(episode: dict):
    return {
        "status": "published",
        "spotify_url": "https://open.spotify.com/mock/episode123",
        "message": f"Episode '{episode['topic']}' sent to Spotify"
    }
