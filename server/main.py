from fastapi import FastAPI
import json

app = FastAPI()

@app.get("/wine/")
async def read_wine(col: int = -1):

    def remove_clutter():
        1



    file_path = "./wine.json"
    with open(file_path, 'r') as file:
        data = json.load(file)

    if col < 0 or col >= len(data[1][0]): return data

    colors = data[1]
    cnt = {}
    for row in colors:
        if row[col] in cnt:
            cnt[row[col]] += 1
        else:
            cnt[row[col]] = 1
    sorted_color = sorted(colors, key=lambda x: -cnt[x[col]])
    sorted_data = [data[0], sorted_color]

    return sorted_data