import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, reservas, unidades

app = FastAPI(title="Coco Bambu API")

origins = [
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(unidades.router, prefix="/unidades", tags=["Unidades"])
app.include_router(reservas.router, prefix="/reservas", tags=["Reservas"])


@app.get("/")
def root():
    return {"message": "API Coco Bambu"}
