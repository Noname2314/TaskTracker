import webview
import json
import requests
import os
import sys
import threading
import time
import winsound
from datetime import datetime, timedelta, timezone
import shutil
import tkinter as tk


# ===== PATH HELPER =====

def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)


# ===== FILES =====

SETTINGS_FILE = "settings.json"
TASKS_FILE = resource_path("app/tasks_status.json")
INDEX_HTML = resource_path("app/ui/index.html")
TIMER_HTML = resource_path("app/ui/timer_create.html")

# icons for windows; keep .ico files under app/icons/ and add them to the PyInstaller spec
MAIN_ICON = resource_path(os.path.join("app", "icons", "main.ico"))
TIMER_ICON = resource_path(os.path.join("app", "icons", "timer.ico"))


def create_backup():
    try:
        if os.path.exists(TASKS_FILE):
            shutil.copy(TASKS_FILE, "tasks_backup.json")
    except Exception as e:
        print("Backup error:", e)


create_backup()

MOSCOW_TZ = timezone(timedelta(hours=3))

window = None
overlay = None


# ===== SETTINGS =====

def load_settings():

    if not os.path.exists(SETTINGS_FILE):
        return {
            "overlay_enabled": True,
            "overlay_position": "top-right"
        }

    with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_settings(data):
    with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)


# ===== OVERLAY =====

class Overlay:

    def __init__(self):

        self.root = tk.Tk()
        self.root.overrideredirect(True)
        self.root.attributes("-topmost", True)
        self.root.configure(bg="black")

        self.label = tk.Label(
            self.root,
            text="",
            fg="white",
            bg="black",
            font=("Arial", 16),
            padx=10,
            pady=5
        )

        self.label.pack()

        self.set_position(load_settings()["overlay_position"])

        threading.Thread(target=self.root.mainloop, daemon=True).start()

    def set_position(self, pos):

        screen_w = self.root.winfo_screenwidth()
        screen_h = self.root.winfo_screenheight()

        if pos == "top-right":
            x = screen_w - 200
            y = 40

        elif pos == "top-left":
            x = 40
            y = 40

        elif pos == "bottom-right":
            x = screen_w - 200
            y = screen_h - 100

        else:
            x = 40
            y = screen_h - 100

        self.root.geometry(f"+{x}+{y}")

    def update(self, name, seconds):

        m = seconds // 60
        s = seconds % 60

        self.label.config(text=f"{name}\n{m:02}:{s:02}")

    def hide(self):
        self.root.withdraw()

    def show(self):
        self.root.deiconify()


# ===== API =====

class Api:

    # ===== ТАЙМЕРЫ =====

    def open_timer_window(self):
        # webview on Windows does not support an "icon" argument –
        # the window will inherit the icon from the hosting executable.
        webview.create_window(
            "Создать таймер",
            TIMER_HTML,
            js_api=self,
            width=420,
            height=300,
            resizable=False,
        )

    def create_timer(self, name, seconds):

        name = str(name).replace("'", "\\'")
        seconds = int(seconds)

        webview.windows[0].evaluate_js(
            f"addTimerFromPython('{name}', {seconds})"
        )

        return {"status": "ok"}

    # ===== OVERLAY =====

    def start_overlay(self, name, seconds):

        global overlay

        settings = load_settings()

        if not settings["overlay_enabled"]:
            return

        if overlay is None:
            overlay = Overlay()

        def run():

            t = seconds

            while t >= 0:

                overlay.update(name, t)

                time.sleep(1)

                t -= 1

            winsound.MessageBeep()
            self.notify("Timer finished", name)

        threading.Thread(target=run, daemon=True).start()

    def toggle_overlay(self, enabled):

        settings = load_settings()
        settings["overlay_enabled"] = enabled
        save_settings(settings)

        if overlay:
            if enabled:
                overlay.show()
            else:
                overlay.hide()

    def set_overlay_position(self, pos):

        settings = load_settings()
        settings["overlay_position"] = pos
        save_settings(settings)

        if overlay:
            overlay.set_position(pos)

    # ===== NOTIFICATIONS =====

    def notify(self, title, text):

        webview.windows[0].evaluate_js(
            f"showNotification('{title}','{text}')"
        )

    # ===== TASKS =====

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
            "x2": False,
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

    def get_tasks(self):
        return self.load_data()

    def update_tasks(self, data_from_js):

        data = self.load_data()

        data["tasks"] = data_from_js.get("tasks", {})
        data["vip"] = data_from_js.get("vip", False)
        data["x2"] = data_from_js.get("x2", False)
        data["last_tab"] = data_from_js.get("last_tab", "solo")

        self.save_data(data)

        return {"status": "updated"}

    # ===== RESET =====

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


# ===== UPDATE SYSTEM =====

GITHUB_USER = "Noname2314"
GITHUB_REPO = "TaskTracker"


def get_current_version():
    if os.path.exists("version.txt"):
        with open("version.txt", "r", encoding="utf-8") as f:
            return f.readline().strip()
    return "0.0.0"


def check_for_updates():
    try:
        url = f"https://api.github.com/repos/{GITHUB_USER}/{GITHUB_REPO}/releases/latest"
        response = requests.get(url, timeout=5)
        data = response.json()

        latest_version = data["tag_name"]
        current_version = get_current_version()

        response = requests.get(url, timeout=5)
        response.raise_for_status()

        if latest_version != current_version:
            return data["assets"][0]["browser_download_url"]

    except Exception as e:
        print("Update check error:", e)

    return None

# ===== START =====

if __name__ == "__main__":

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    HTML = os.path.join(BASE_DIR, "ui", "index.html")

    # main and timer icon paths are defined at module level

    api = Api()

    # create the main application window; on Windows icon argument is ignored
    # the executable's icon (specified in the PyInstaller spec) is used instead
    window = webview.create_window(
        "TaskTracker",
        HTML,
        js_api=api,
        width=1000,
        height=700,
    )

    webview.start(debug=False)

    update_url = check_for_updates()

    if update_url:
        print("Update available:", update_url)
