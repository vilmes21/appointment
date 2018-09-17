import React from 'react';
import {Link} from 'react-router-dom'

export default class AdminDoctorLi extends React.Component {
    render() {
        const {dr} = this.props;
        return (
            <div key={dr.id}>
                {dr.firstname} &nbsp;
                {dr.lastname} &nbsp;
                {dr.is_public || <strong>(Not visible to public)</strong>
}
foo
                <Link to={"/admin/appointment/" + dr.lastname}>
                    <button>view bookings</button>
                </Link>

                <Link to={"/admin/availability/" + dr.lastname}>
                    <button>set availability</button>
                </Link>
                <hr/>
            </div>
        );
    }

}
