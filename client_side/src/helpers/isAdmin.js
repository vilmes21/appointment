import isAuthed from 'helpers/isAuthed'

export default userObj => {
    return isAuthed(userObj) && userObj.isAdmin;
}