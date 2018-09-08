import React from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import TopError from "components/smart/TopError"
import {connect} from 'react-redux';
import isAuthed from 'helpers/isAuthed'
import isAdmin from 'helpers/isAdmin'
import RoutesSummary from '../dumb/RoutesSummary';
import LinksSummary from 'components/dumb/LinksSummary'

class Layout extends React.Component {
    render = () => {
        const {authenticated, isAdmin} = this.props;

        return (
            <div>
                <TopError/>

                <Router>
                    <div>
                        <ul>
                            <LinksSummary authenticated ={authenticated} isAdmin={isAdmin}/>
                        </ul>
                        <hr/>

                        <Switch>
                            <RoutesSummary authenticated ={authenticated} isAdmin={isAdmin}/>
                        </Switch>
                    </div>
                </Router>

            </div>
        );
    }
}

const mapState = state => {
    return {
        authenticated: isAuthed(state.currentUser),
        isAdmin: isAdmin(state.currentUser)
    };
}

export default connect(mapState, {})(Layout);