import json
import os

DATA_FILE = "data/app_state.json"


class Api:

    def load_state(self):

        if not os.path.exists(DATA_FILE):
            return {}

        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)

    def save_state(self, data):

        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

        return True