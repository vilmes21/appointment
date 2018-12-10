import React from 'react';
import {Link} from 'react-router-dom'

export default class AdminDoctorLi extends React.Component {
    render() {
        const {dr} = this.props;
        return (
            <div>
                {dr.firstname}
                &nbsp; {dr.lastname}
                &nbsp; {dr.is_public || <strong>(Not visible to public)</strong>
}

                {/* admin/appointment/456 */}
                <Link to={"/admin/appointment/" + dr.id}>
                    <button className="btn1">view bookings</button>
                </Link>

                <Link to={"/admin/availability/" + dr.lastname}>
                    <button className="btn1">set availability</button>
                </Link>
                <hr/>
            </div>
        );
    }

}
