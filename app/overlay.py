import webview
import threading
import time


class OverlayWindow:

    def __init__(self):

        self.window = None
        self.time_left = 0
        self.running = False
        self.window_started = False


    def create_window(self):

        self.window = webview.create_window(
            "Timer Overlay",
            "overlay_timer.html",
            width=200,
            height=80,
            frameless=True,
            on_top=True,
            transparent=True
        )

        self.window_started = True

        webview.start(gui="edgechromium")


    def start_timer(self, seconds):

        self.time_left = int(seconds)
        self.running = True

        # запуск окна только один раз
        if not self.window_started:
            threading.Thread(target=self.create_window, daemon=True).start()

        # запуск таймера
        threading.Thread(target=self.timer_loop, daemon=True).start()


    def stop_timer(self):

        self.running = False


    def timer_loop(self):

        while self.running and self.time_left >= 0:

            try:

                if self.window:
                    self.window.evaluate_js(
                        f"startOverlay({self.time_left})"
                    )

            except Exception as e:
                print("Overlay JS error:", e)

            time.sleep(1)

            self.time_left -= 1