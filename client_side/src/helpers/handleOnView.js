export default thisContext => {
    return async(param) => {
        const _this = thisContext;

        console.log("handleOnView func. param>>> ", param)

        if (["agenda", "week"].indexOf(param) === -1) {
            return;
        }

        let _filtered;

        const {booked, updateList} = _this.props;

        if (param === "week") {
            _filtered = _this.state.allOccupants;
        } else if (param === "agenda") {

            //first save allOccupants in react state , NOT redux store !!!
            _this.setState({
                allOccupants: booked
            });

            _filtered = booked.filter(item => {
                return item.isMine;
            });
        }

        await updateList(_filtered);
    }
}