import consts from "../consts";

export default thisContext => {
    return (event, start, end, isSelected) => {
        // console.log("what params?"); console.log(   "\nevent >>>\n",   event,
        // "\nstart >>>\n",   start,   "\nend >>>\n",   end,   "\nisSelected >>>\n",
        // isSelected );

        let newStyle = {
            backgroundColor: consts.disabledColor,
            color: 'black',
            borderRadius: "0px",
            border: "none"
        };

        if (event.isMine) {
            newStyle.backgroundColor = "lightgreen"
        }

        return {className: "", style: newStyle};
    }
}