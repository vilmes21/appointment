import React from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import TopError from "components/smart/TopError"
import {connect} from 'react-redux';
import isAuthed from 'helpers/isAuthed'
import isAdmin from 'helpers/isAdmin'
import RoutesSummary from '../dumb/RoutesSummary';
import LinksSummary from 'components/dumb/LinksSummary'
import {checkAuthNow} from 'actions/users'
import Spinner from 'components/dumb/Spinner'
import TestLists from 'components/admin/TestLists.js'
import CancelBtn from '../admin/CancelBtn';

class Layout extends React.Component {
    componentDidMount(){
        const { authenticated, checkAuthNow } = this.props;
        if (!authenticated){
            //question: by the time is gets results back, render func already redirected user to login page. What should I do instead?

            checkAuthNow();
        }
    }
    
    render = () => {
        const { isLoading } = this.props;

        if (isLoading){
            return <Spinner />
        }

        const { authenticated, isAdmin} = this.props;

        return (
            <div>
                <CancelBtn />
                <TestLists />
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
        isLoading: state.isLoading,
        authenticated: isAuthed(state.currentUser),
        isAdmin: isAdmin(state.currentUser)
    };
}

export default connect(mapState, {checkAuthNow})(Layout);