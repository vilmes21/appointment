import React from 'react';
import {Link} from 'react-router-dom'

export default class ToAuthLinks extends React.Component {
    render() {
        return (
            <span>
                <li>
                    <Link to="/sign_up">Signup</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
            </span>
        );

    }
}
