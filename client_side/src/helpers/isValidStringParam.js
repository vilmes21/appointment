export default param => {
    if (!param || typeof param !== "string" || param.indexOf(" ") > -1) {
        return false;
    }
    return true;
}