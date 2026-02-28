import webview
import json
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