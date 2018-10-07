//obj, string
//eg. (req, "session.passport.user")
const getNestedPropByPath = (obj, path) => {
    let level = obj;
    const pathArr = path.split(".");
    for (const levelName of pathArr) {
        level = level[levelName];
        if (typeof level === "undefined"){
            return undefined;
        }
    }
    return level;
}

module.exports = getNestedPropByPath