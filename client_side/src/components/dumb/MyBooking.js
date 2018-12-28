import React from 'react';

export default class MyBooking extends React.Component {
    render() {
        const {
            id,
            drFullName,
            start,
            end,
            canBeCancelled
        } = this.props.data;

        const {remove}=this.props;
        
        return <tr>
            {/* <div>id: {id}</div> */}
            <td>{drFullName}</td>
            <td>{start}</td>
            <td>{end}</td>
            <td>
                <button
                    disabled={!canBeCancelled}
                    className={"btn1 " + canBeCancelled? "": "disabled"}
                    title={canBeCancelled
                    ? ""
                    : "Too late to cancel this appointment"}
                    onClick=
                    { () => { remove(id) } }>
                    Cancel
                </button>
            </td>
        </tr>
    }
}
