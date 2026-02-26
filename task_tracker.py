import webview
import json
import os
import sys

def resource_path(relative_path):
    """Путь к ресурсам в exe (PyInstaller / auto-py-to-exe)"""
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

INDEX_HTML = resource_path("index.html")
TASKS_FILE = resource_path("tasks_status.json")

class Api:
    def load_data(self):
        if not os.path.exists(TASKS_FILE):
            default_data = {"vip": False, "tasks": []}
            self._create_default_tasks(default_data)
            return default_data
        try:
            with open(TASKS_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            data = {"vip": False, "tasks": []}
        if "vip" not in data or not isinstance(data["vip"], bool):
            data["vip"] = False
        if "tasks" not in data or not isinstance(data["tasks"], list) or len(data["tasks"]) == 0:
            self._create_default_tasks(data)
        return data

    def _create_default_tasks(self, data):
        data["tasks"] = [
            {"id": 1, "title": "Посетить любой сайт в браузере", "bp": 1, "status": "progress"},
            {"id": 2, "title": "Зайти в любой канал в Brawl", "bp": 1, "status": "progress"},
            {"id": 3, "title": "Поставить лайк любой анкете в Match", "bp": 1, "status": "progress"},
            {"id": 4, "title": "Кинуть мяч питомцу 15 раз", "bp": 2, "status": "progress"},
            {"id": 5, "title": "15 выполненных питомцем команд", "bp": 2, "status": "progress"},
            {"id": 6, "title": "Ставка в колесе удачи в казино", "bp": 3, "status": "progress"},
            {"id": 7, "title": "Проехать 1 станцию на метро", "bp": 2, "status": "progress"},
            {"id": 8, "title": "Поймать 20 рыб", "bp": 4, "status": "progress"},
            {"id": 9, "title": "Выполнить 2 квеста любых клубов", "bp": 4, "status": "progress"},
            {"id": 10, "title": "Починить деталь в автосервисе", "bp": 1, "status": "progress"},
            {"id": 11, "title": "Забросить 2 мяча в баскетболе", "bp": 1, "status": "progress"},
            {"id": 12, "title": "Забить 2 гола в футболе", "bp": 1, "status": "progress"},
            {"id": 13, "title": "Победить в армрестлинге", "bp": 1, "status": "progress"},
            {"id": 14, "title": "Победить в дартс", "bp": 1, "status": "progress"},
            {"id": 15, "title": "Поиграть 1 минуту в волейбол", "bp": 1, "status": "progress"},
            {"id": 16, "title": "Поиграть 1 минуту в настольный теннис", "bp": 1, "status": "progress"},
            {"id": 17, "title": "Поиграть 1 минуту в большой теннис", "bp": 1, "status": "progress"},
            {"id": 18, "title": "Сыграть в мафию в казино", "bp": 3, "status": "progress"},
            {"id": 19, "title": "Сделать платеж по лизингу", "bp": 1, "status": "progress"}
        ]
        self.save_data(data)

    def save_data(self, data):
        try:
            with open(TASKS_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            return {"status": "saved"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    api = Api()
    window = webview.create_window(
        "TaskTracker",
        INDEX_HTML,
        js_api=api,
        width=1000,
        height=700
    )
    # Сохраняем данные при закрытии
    webview.start(lambda: api.save_data(api.load_data()))