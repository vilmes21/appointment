
import consts from "consts"


export default (isAdmin, showDetail) => {
    console.log(`consts.outOfOffice: ${consts.outOfOffice}`)
    return event => {

        if (isAdmin){
console.log(`event.type: ${event.type}`)
            if (event.type === consts.outOfOffice){

                return;
            }
            
            const detail = {
                start: event.start.toLocaleString(),
                end: event.end.toLocaleString(),
                name: "Tom Waston"
            }
            showDetail(detail);
        } else {
            if (!event.isMine) {
                alert("Slot already taken");
                return;
            }
            alert("my apm: " + event.title);
        }
    }
}