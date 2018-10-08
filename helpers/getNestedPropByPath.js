const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");

//obj, string eg. (req, "session.passport.user")
const getNestedPropByPath = (obj, path) => {
    let level = obj;
    try {

        const pathArr = path.split(".");
        for (const levelName of pathArr) {
            level = level[levelName];
            if (typeof level === "undefined") {
                return undefined;
            }
        }
    } catch (e) {
        addLog(null, e, `fn /helpers/getNestedPropByPath.js. param path>>>${path}; obj>>>${JSON.stringify(obj)}`);
    }
    return level;
}

module.exports = getNestedPropByPath