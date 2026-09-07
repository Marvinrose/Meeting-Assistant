import os

from dotenv import load_dotenv
from .services.storage import supabase, BUCKET_NAME

load_dotenv()

key = os.getenv("SUPABASE_SECRET_KEY")

print("Bucket:", BUCKET_NAME)

if not key:
    print("SECRET KEY: NOT FOUND")
else:
    print("Secret key loaded: YES")
    print("Key length:", len(key))
    print("Key prefix:", key[:12])

print("\nTesting Storage list...")

try:
    files = (
        supabase.storage
        .from_(BUCKET_NAME)
        .list()
    )

    print("Storage list succeeded:")
    print(files)

except Exception as exc:
    print("Storage list failed:")
    print(repr(exc))