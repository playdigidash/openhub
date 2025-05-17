from fastapi import FastAPI, Response
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import gridfs
from datetime import datetime
import io
from PIL import Image
import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import re
import requests

client = MongoClient("mongodb+srv://sai-jyotheesh:QhQ6wvcqUx0WkOg6@cluster0.llb6usf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['url_assets_db']
fs = gridfs.GridFS(db)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLRequest(BaseModel):
    url: str

@app.post("/extract")
def extract_url_content(req: URLRequest):
    return asyncio.run(process_url(req.url))

async def process_url(url):
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            await page.goto(url, timeout=30000)
            await page.wait_for_selector("body", timeout=10000)
            html = await page.content()
            await browser.close()

        soup = BeautifulSoup(html, 'html.parser')
        for script in soup(["script", "style"]):
            script.extract()
        text = ' '.join(soup.stripped_strings)

        text_file_id = fs.put(text.encode('utf-8'), filename=f"text_{datetime.utcnow().isoformat()}.txt")

        images = soup.find_all('img')
        profile_image = None
        banner_image = None
        profile_alt = ""
        banner_alt = ""

        for img in images:
            src = img.get('src')
            if not src:
                continue
            src = urljoin(url, src)
            alt = img.get('alt', '').lower()

            if not profile_image and ("profile" in alt or "avatar" in alt or "logo" in alt):
                profile_image = src
                profile_alt = alt

            if not banner_image and ("banner" in alt or "header" in alt or "background" in alt):
                banner_image = src
                banner_alt = alt

        if not banner_image:
            style_divs = soup.find_all(style=True)
            for div in style_divs:
                style = div['style']
                match = re.search(r'background(?:-image)?:.*?url\([\'"]?(.*?)[\'"]?\)', style)
                if match:
                    banner_image = urljoin(url, match.group(1))
                    banner_alt = "background-style"
                    break

        def save_image_to_gridfs(image_url, tag):
            try:
                img_resp = requests.get(image_url, timeout=10)
                img_io = io.BytesIO(img_resp.content)
                img = Image.open(img_io)
                img_format = img.format or 'JPEG'
                file_id = fs.put(img_resp.content, filename=f"{tag}_{datetime.utcnow().isoformat()}.{img_format.lower()}", content_type=f"image/{img_format.lower()}")
                return file_id
            except:
                return None

        profile_id = save_image_to_gridfs(profile_image, "profile") if profile_image else None
        banner_id = save_image_to_gridfs(banner_image, "banner") if banner_image else None

        db.metadata.insert_one({
            "url": url,
            "timestamp": datetime.utcnow(),
            "text_file_id": text_file_id,
            "text_preview": text[:300],
            "images": [
                {"type": "profile", "alt": profile_alt, "src": profile_image, "file_id": profile_id},
                {"type": "banner", "alt": banner_alt, "src": banner_image, "file_id": banner_id}
            ]
        })

        return {
            "status": "success",
            "profile_image": str(profile_image),
            "banner_image": str(banner_image),
            "text_file_id": str(text_file_id),
            "text_preview": text[:500],
            "profile_file_id": str(profile_id),
            "banner_file_id": str(banner_id)
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/text/{file_id}")
def get_text_file(file_id: str):
    try:
        grid_out = fs.get(file_id)
        return Response(content=grid_out.read(), media_type="text/plain")
    except Exception as e:
        return {"error": str(e)}

@app.get("/image/{file_id}")
def get_image_file(file_id: str):
    try:
        grid_out = fs.get(file_id)
        return Response(content=grid_out.read(), media_type=grid_out.content_type)
    except Exception as e:
        return {"error": str(e)}