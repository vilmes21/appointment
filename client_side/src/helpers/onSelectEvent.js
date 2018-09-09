export default () => {
    return event => {
        if (!event.isMine) {
            alert("Slot already taken");
            return;
        }
        alert("my apm: " + event.title);
    }
}