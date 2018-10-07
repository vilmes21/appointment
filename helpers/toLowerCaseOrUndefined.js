const toLowerCaseOrUndefined = potentialString => {
    if (typeof potentialString === "string") {
        return potentialString.toLowerCase();
    }
    return undefined;
}

module.exports = toLowerCaseOrUndefined;