const findDrIdByUrlName = urlName => {
    if (typeof(urlName) !== "string" || urlName.indexOf(" ") > -1){
        return false;
    }
    
    const drs = { //TODO: go into db grab and then cache in session
        hermann: 205,
        a_last: 211,
        b_last: 212,
        wang: 210
      };
    return drs[urlName.toLowerCase()];
} 

module.exports = findDrIdByUrlName