
function sortNum(key, a, b) {
    if (a[key] == undefined && b[key] == undefined) return 0;
    if (a[key] == undefined) return 1;
    if (b[key] == undefined) return -1;
    return a[key]-b[key];
}
function sortString(key, a, b) {
    if ((a[key] == undefined || a[key] == null) && (b[key] == undefined || b[key] == null)) return 0;
    if (a[key] == undefined || a[key] == null) return 1;
    if (b[key] == undefined || b[key] == null) return -1;
    return a[key].localeCompare(b[key]);
}
function sortStr(key, a, b) {
    if ((a[key] == undefined) && (b[key] == undefined)) return 0;
    if (a[key] == undefined) return 1;
    if (b[key] == undefined) return -1;
    return a[key].localeCompare(b[key]);
}
function sortNull(key, a, b) {
    return ((b[key] == null)? 1:0) - ((a[key] == null)? 1:0)
}

module.exports = { sortNum, sortString, sortStr, sortNull }