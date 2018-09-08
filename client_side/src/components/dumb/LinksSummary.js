import React from 'react';
import {Link} from 'react-router-dom'
import AdminLinks from 'components/dumb/AdminLinks'
import ToAuthLinks from 'components/dumb/ToAuthLinks'
import Logout from "components/smart/Logout"

export default class LinksSummary extends React.Component {
    render() {
        const { authenticated, isAdmin } = this.props;

        return (
            <span>
                {isAdmin && <AdminLinks/>}
                <li>
                    <Link to="/doctors">Doctors</Link>
                </li>

                {authenticated && <li>
                    <Link to="/my_account">MyAccount</Link>
                </li>}

                {authenticated && <Logout/>}

                {authenticated || <ToAuthLinks/>}
            </span>
        );

    }
}
