import os
import subprocess
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/github", tags=["github"])

class PushRequest(BaseModel):
    filename: str
    content: str
    commit_message: str

@router.post("/push")
def push_to_github(payload: PushRequest):
    # Locate project root directory (two levels up from routers)
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    projects_dir = os.path.join(root_dir, "projects")

    # Create projects/ folder if not exists
    os.makedirs(projects_dir, exist_ok=True)

    # Clean filename to prevent path traversal
    safe_filename = os.path.basename(payload.filename)
    file_path = os.path.join(projects_dir, safe_filename)

    try:
        # 1. Write the code file to projects/
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(payload.content)

        # 2. Run git status to see if inside repo
        status_res = subprocess.run(["git", "status"], cwd=root_dir, capture_output=True, text=True, check=False)
        if status_res.returncode != 0:
            raise HTTPException(status_code=500, detail="Local workspace is not an active Git repository.")

        # 3. Git add the file
        add_res = subprocess.run(["git", "add", f"projects/{safe_filename}"], cwd=root_dir, capture_output=True, text=True, check=False)
        if add_res.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Git Add failed: {add_res.stderr}")

        # 4. Git commit
        commit_res = subprocess.run(["git", "commit", "-m", payload.commit_message], cwd=root_dir, capture_output=True, text=True, check=False)
        # Note: commit might return non-zero if nothing changed, which is fine
        
        # 5. Git push to remote origin
        push_res = subprocess.run(["git", "push"], cwd=root_dir, capture_output=True, text=True, check=False)
        if push_res.returncode != 0:
            # Check if it was because nothing to push
            if "Everything up-to-date" not in push_res.stderr and "Everything up-to-date" not in push_res.stdout:
                raise HTTPException(status_code=500, detail=f"Git Push failed: {push_res.stderr or push_res.stdout}")

        return {"status": "ok", "message": f"Successfully pushed projects/{safe_filename} to remote repository."}

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
