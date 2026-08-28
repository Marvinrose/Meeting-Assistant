from .supabase_client import (
    supabase,
    SUPABASE_BUCKET,
)


def test_supabase_storage():
    response = (
        supabase.storage
        .from_(SUPABASE_BUCKET)
        .list()
    )

    print("Supabase Storage connected successfully.")
    print(response)