from fastapi import FastAPI

# Create the FastAPI app instance
app = FastAPI()


# GET /health → simple health check endpoint
@app.get("/health")
def health_check():
    """
    Health check endpoint.

    - Method: GET (we are only READING status, not changing data)
    - Returns: a small JSON saying the backend is alive.
    """
    return {"status": "ok"}
