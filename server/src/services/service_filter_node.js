const { ObjectId } = require("mongoose").Types;

function copyObjectWithIdToString(object) {
  return JSON.parse(
    JSON.stringify(object, (key, value) => {
      if (key === "_id" && value instanceof ObjectId) {
        return value.toString(); // Convert ObjectId to string
      }
      return value;
    })
  );
}

function excludeNodeFields(object, fieldsToExclude, seen = new WeakSet()) {
  if (typeof object !== "object" || object === null || seen.has(object)) {
    return object;
  }

  seen.add(object);

  if (Array.isArray(object)) {
    return object.map((item) => excludeNodeFields(item, fieldsToExclude, seen));
  }

  const includedFields = Object.keys(object).filter(
    (field) => !fieldsToExclude.includes(field)
  );

  const filteredObject = includedFields.reduce((result, field) => {
    result[field] = excludeNodeFields(object[field], fieldsToExclude, seen);
    return result;
  }, {});

  return filteredObject;
}

function filterNodeFields(node, filter) {
  const stringifiedNode = copyObjectWithIdToString(node);
  return excludeNodeFields(stringifiedNode, filter);
}

module.exports = { filterNodeFields };
