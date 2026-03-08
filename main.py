import eel
from task_tracker import TaskTracker
from overlay import OverlayWindow

tracker = TaskTracker()
overlay = OverlayWindow()

eel.init("web")

@eel.expose
def create_task(name, minutes):

    tracker.create_task(name, minutes)

    seconds = minutes * 60

    overlay.start_timer(seconds)

    return True


@eel.expose
def start_timer(seconds):

    overlay.start_timer(seconds)

    return True


@eel.expose
def stop_timer():

    overlay.stop_timer()

    return True


@eel.expose
def get_tasks():

    return tracker.get_tasks()


def main():

    eel.start(
        "index.html",
        size=(900,600)
    )


if __name__ == "__main__":
    main()