import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Setup models locally to modify DB
from database import User

def main():
    print("--- Lumina AI Admin Promotion Utility ---")
    
    # Prompt for connection string
    db_url = input("\nPaste your Supabase URI connection string:\n").strip()
    if not db_url:
        print("Error: No connection string provided.")
        return

    # Fix postgres prefix if needed
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    try:
        engine = create_engine(db_url)
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()
        
        username = input("\nEnter the username you want to promote to Admin:\n").strip()
        user = db.query(User).filter(User.username == username).first()
        
        if not user:
            print(f"Error: User '{username}' not found in the database. Make sure you registered on the website first!")
            db.close()
            return
            
        user.is_admin = True
        db.commit()
        print(f"\nSUCCESS: User '{username}' has been promoted to Admin!")
        db.close()
        
    except Exception as e:
        print(f"\nDatabase Connection Error: {e}")

if __name__ == "__main__":
    main()
