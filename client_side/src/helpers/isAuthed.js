export default userObj => {
    return !!userObj && !!userObj.email && userObj.id > 0
}