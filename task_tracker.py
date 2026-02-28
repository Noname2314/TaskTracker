import webview
import json
import requests
import subprocess
import os
import sys
from datetime import datetime, timedelta, timezone

def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

INDEX_HTML = resource_path("index.html")
TASKS_FILE = resource_path("tasks_status.json")

MOSCOW_TZ = timezone(timedelta(hours=3))


class Api:

    def check_update(self):
        update_url = check_for_updates()

        if not update_url:
            return "no_update"

        if download_update(update_url):
            apply_update()
            return "updated"

        return "error"

    def load_data(self):
        if not os.path.exists(TASKS_FILE):
            data = self._default_data()
            self.save_data(data)
            return data

        try:
            with open(TASKS_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
        except:
            data = self._default_data()

        self._check_reset(data)
        return data

    def _default_data(self):
        return {
            "last_reset": None,
            "vip": False,
            "last_tab": "solo",
            "tasks": {
                "solo": [],
                "pair": [],
                "faction": []
            }
        }

    def save_data(self, data):
        with open(TASKS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        return {"status": "saved"}

    def _check_reset(self, data):
        now = datetime.now(MOSCOW_TZ)
        reset_time = now.replace(hour=7, minute=0, second=0, microsecond=0)

        if now < reset_time:
            reset_time -= timedelta(days=1)

        last_reset = data.get("last_reset")

        if last_reset is None:
            data["last_reset"] = reset_time.isoformat()
            self.save_data(data)
            return

        last_reset_dt = datetime.fromisoformat(last_reset)

        if last_reset_dt < reset_time:
            data["tasks"] = {
                "solo": [],
                "pair": [],
                "faction": []
            }
            data["last_reset"] = reset_time.isoformat()
            self.save_data(data)

    # ===== API =====

    def get_tasks(self):
        return self.load_data()

    def update_tasks(self, data_from_js):
        data = self.load_data()

        data["tasks"] = data_from_js.get("tasks", {})
        data["vip"] = data_from_js.get("vip", False)
        data["last_tab"] = data_from_js.get("last_tab", "solo")

        self.save_data(data)

        return {"status": "updated"}

GITHUB_USER = "Noname2314"
GITHUB_REPO = "TaskTracker"

def get_current_version():
    if os.path.exists("version.txt"):
        with open("version.txt", "r") as f:
            return f.read().strip()
    return "0.0.0"


def check_for_updates():
    try:
        url = f"https://api.github.com/repos/{GITHUB_USER}/{GITHUB_REPO}/releases/latest"
        response = requests.get(url, timeout=5)
        data = response.json()

        latest_version = data["tag_name"]
        current_version = get_current_version()

        if latest_version != current_version:
            return data["assets"][0]["browser_download_url"]

    except Exception as e:
        print("Update check error:", e)

    return None


def download_update(url):
    try:
        response = requests.get(url, stream=True)
        with open("TaskTracker_new.exe", "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except:
        return False


def apply_update():
    current_exe = sys.executable
    new_exe = os.path.join(os.getcwd(), "TaskTracker_new.exe")

    if not os.path.exists(new_exe):
        return

    updater_script = os.path.join(os.getcwd(), "updater.bat")

    with open(updater_script, "w") as f:
        f.write(f"""@echo off
ping 127.0.0.1 -n 3 > nul
taskkill /f /im "{os.path.basename(current_exe)}"
ping 127.0.0.1 -n 2 > nul
move /y "{new_exe}" "{current_exe}"
start "" "{current_exe}"
del "%~f0"
""")

    subprocess.Popen(["cmd", "/c", updater_script])
    sys.exit()


if __name__ == "__main__":
    api = Api()
    window = webview.create_window(
        "TaskTracker",
        INDEX_HTML,
        js_api=api,
        width=1000,
        height=700
    )
    webview.start()