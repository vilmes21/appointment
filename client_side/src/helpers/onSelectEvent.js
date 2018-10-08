import consts from "consts"

const buildDetail = event => {
    const {id, start, end, firstname, lastname} = event;
    
    return {
        start: start
            .toLocaleString(),
        end: end
            .toLocaleString(),
        firstname,
        lastname,
        id
    }
}

export default(isAdmin, showDetail) => {
    return event => {
        if (isAdmin) {
            if (event.type === consts.outOfOffice) {
                return;
            }

            showDetail(buildDetail(event));
            return;
        } 

        if (!event.isMine) {
            return;
        }

        showDetail(buildDetail(event));
    }
}