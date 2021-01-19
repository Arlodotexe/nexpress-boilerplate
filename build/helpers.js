"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @summary Get the first matching regex group, instead of an array with the full string and all matches
 * @param {string} toMatch
 * @param {regex} regex
 * @returns {string} First matching regex group
 */
function match(toMatch, regex) {
    var m = regex.exec(toMatch);
    return (m && m[1]) ? m[1] : undefined;
}
exports.match = match;
function replaceAll(text, target, replacement) {
    return text.split(target).join(replacement);
}
exports.replaceAll = replaceAll;
;
function remove(text, target) {
    return text.split(target).join("");
}
exports.remove = remove;
;
/***
 * @summary Compute the edit distance between two given strings
 * @see https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance#JavaScript
 */
function levenshteinDistance(a, b) {
    if (a.length === 0)
        return b.length;
    if (b.length === 0)
        return a.length;
    var matrix = [];
    var i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    var j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                Math.min(matrix[i][j - 1] + 1, // insertion
                matrix[i - 1][j] + 1)); // deletion
            }
        }
    }
    return matrix[b.length][a.length];
}
exports.levenshteinDistance = levenshteinDistance;
;
function capitalizeFirstLetter(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function camelCaseToSpacedString(toConvert) {
    return capitalizeFirstLetter(toConvert.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5'));
}
exports.camelCaseToSpacedString = camelCaseToSpacedString;
exports.DEVENV = process.env.environment == "development";
//# sourceMappingURL=helpers.js.map