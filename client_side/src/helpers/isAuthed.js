export default userObj => {
    return !!userObj && !!userObj.firstname && userObj.id > 0
}