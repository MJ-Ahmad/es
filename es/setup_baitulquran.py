import os

# Define the folder structure
structure = {
    "baitulquran": {
        "frontend": {
            "assets": {
                "css": ["style.css"],
                "js": ["timers.js", "attendance.js", "dashboard.js"],
                "images": {
                    "logos": [],
                    "icons": []
                }
            },
            "dashboards": {
                "ustad": ["ustad_dashboard.html", "ustad_dashboard.json"],
                "supervisor": ["supervisor_dashboard.html", "supervisor_data.json"],
                "principal": ["principal_dashboard.html", "principal_data.json"],
                "student": ["student_dashboard.html", "students_group.json"]
            },
            "attendance": [
                "attendance_page.html",
                "attendance_log.json",
                "rewards.json",
                "audit_trail.json"
            ],
            "index.html": None,
            "login.html": None
        },
        "backend": {
            "api": ["auth.js", "attendance_api.js", "dashboard_api.js", "audit_api.js"],
            "config": ["db_config.json", "storage_policy.json"],
            "logs": ["system.log", "error.log"]
        },
        "data": {
            "BitulQuran.json": None,
            "groups": ["groupA.json", "groupB.json", "groupC.json"],
            "departments.json": None
        },
        "tests": ["dashboard_tests.md", "attendance_tests.md", "audit_tests.md"],
        "docs": ["deployment_guide.md", "qa_checklist.md", "roadmap.json"],
        "timeline.json": None
    }
}

def create_structure(base_path, tree):
    for name, content in tree.items():
        path = os.path.join(base_path, name)
        if isinstance(content, dict):
            os.makedirs(path, exist_ok=True)
            create_structure(path, content)
        elif isinstance(content, list):
            os.makedirs(path, exist_ok=True)
            for file in content:
                file_path = os.path.join(path, file)
                open(file_path, 'w').close()
        elif content is None:
            # Create file directly
            open(path, 'w').close()

if __name__ == "__main__":
    base_dir = os.getcwd()
    create_structure(base_dir, structure)
    print("✅ Baitul Quran folder tree created successfully!")
