import React from 'react';
import AdminDoctorLi from 'components/admin/dumb/AdminDoctorLi'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import isAuthed from 'helpers/isAuthed'
import isAdmin from 'helpers/isAdmin'
import {adminGetList} from 'actions/doctors'

class DoctorList extends React.Component {

    componentDidMount(){
        this.props.adminGetList()
    }

    render() {
        const {isAdmin, authenticated, drs} = this.props;

        if (!authenticated){
          return <Redirect to="/login"/>
        }
        
        if (!isAdmin) {
            return <Redirect to="/"/>
        }

        let may_list = null;

        if (drs && drs.length > 0) {
            may_list = drs.map(dr => {
                return <AdminDoctorLi key={dr.id} dr={dr}/>
            });
        }

        return (
            <div>
                <h2>
                  admin, Set availability for
                </h2>
                {may_list}
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