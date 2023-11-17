from fastapi import FastAPI
import json

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/wine/")
async def read_wine(col: int = -1):
    print(col)
    file_path = "./wine.json"
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data