import React from 'react';
import formatTime4User from 'helpers/formatTime4User'
import bookingApi from '../../helpers/bookingApi';

export default class MyBooking extends React.Component {

    state = {
        isConfirmingCancel: false
    }

    toggleConfirmCancel = () => {
        this.setState((state, prop) => {
            return {
                isConfirmingCancel: !state.isConfirmingCancel
            }
        })
    }

    cancel = async id => {
        const res = await bookingApi.cancel([id]);
        const {showErr, remove} = this.props;
        if (res) {
            if (res.success.length > 0) {
                remove(id);
            } else if (res.msg) {
                showErr(res.msg)
            }
        } else {
            showErr("Server error")
        }
    }

    render() {
        const {id, drFullName, start, end, canBeCancelled} = this.props.data;

        const classBtn = "btn1 " + (canBeCancelled
            ? ""
            : "disabled");

        const {isConfirmingCancel} = this.state;

        return <tr>
            {/* <div>id: {id}</div> */}

            <td className="textAlignCenter">{drFullName}</td>
            <td className="textAlignCenter">{formatTime4User(start)}</td>
            <td className="textAlignCenter">{formatTime4User(end)}</td>
            <td className="textAlignCenter d360Tdcxk">
                <button
                    disabled={!canBeCancelled}
                    className={classBtn}
                    title={canBeCancelled
                    ? ""
                    : "Too late to cancel"}
                    onClick=
                    { ()=>{ this.toggleConfirmCancel() } }>
                    {isConfirmingCancel
                        ? "Keep"
                        : "Cancel"}
                </button>
                {isConfirmingCancel && <button className="btn1 dangerBtn" onClick= { () => { this.cancel(id) } }>
                    Yes, cancel
                </button>
}

            </td>
        </tr>
    }
}
