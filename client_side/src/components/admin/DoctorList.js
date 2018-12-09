import React from 'react';
import AdminDoctorLi from 'components/admin/dumb/AdminDoctorLi'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import isAuthed from 'helpers/isAuthed'
import isAdmin from 'helpers/isAdmin'
import {adminGetList} from 'actions/doctors'

class DoctorList extends React.Component {
    componentDidMount() {
        const {drs, adminGetList} = this.props;

        if (!(Array.isArray(drs) && drs.length > 0)){
            adminGetList();
        } 
    }

    renderList = drs => {
        if (!drs || drs.length === 0) {
            return null;
        }

        return drs.map(dr => {
            return <AdminDoctorLi key={dr.id} dr={dr}/>
        });
    }

    render() {
        const {isAdmin, authenticated, drs} = this.props;

        if (!authenticated) {
            return <Redirect to="/login"/>
        }

        if (!isAdmin) {
            return <Redirect to="/"/>
        }

        return (
            <div>
                <h2>
                    Manage
                </h2>
                {this.renderList(drs)}
            </div>
        );
    }
}

const mapState = state => {
    return {
        authenticated: isAuthed(state.currentUser),
        isAdmin: isAdmin(state.currentUser),
        drs: state.doctors
    };
}

export default connect(mapState, {adminGetList})(DoctorList);