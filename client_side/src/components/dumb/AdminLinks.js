import React from 'react';
import {Link} from 'react-router-dom'

export default class AdminLinks extends React.Component {
    render() {
        return (
            <li>
                <Link to="/admin/doctors">admin-View Doctors</Link>
            </li>
        );

    }
}
