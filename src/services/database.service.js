const connection = require("../configs/db.config");

const executeQuery = async (query) => {
	var sql = query;
	return new Promise((resolve, reject) => {
		connection.query(sql, (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const insert = async (tableName, objData) => {
	var fields = "";
	var values = "";
	for (const key in objData) {
		fields += key + ", ";
		values += "'" + objData[key] + "',";
	}
	fields = fields.replace(/,\s*$/, "");
	values = values.replace(/,\s*$/, "");

	const insertQuery = "INSERT INTO " + tableName + " (" + fields + ") VALUES (" + values + ")";
	const queryResponse = await executeQuery(insertQuery);
	return queryResponse;
};

const update = async (tableName, objData, condition) => {
	var values = "";
	for (const key in objData) {
		values += "" + key + "='" + objData[key] + "', ";
	}
	values = values.replace(/,\s*$/, "");

	const updateQuery = "UPDATE " + tableName + " SET  " + values + " " + condition + "";
	const queryResponse = await executeQuery(updateQuery);
	return queryResponse;
};

const destroy = async (tableName, condition) => {
	const deleteQuery = "DELETE FROM " + tableName + "  " + condition + "";
	const queryResponse = await executeQuery(deleteQuery);
	return queryResponse;
};

const getRow = async (getSelectQuery) => {
	const singleSelectQuery = getSelectQuery;
	const queryResponse = await executeQuery(singleSelectQuery);
	return queryResponse[0];
};

const getRows = async (getSelectQuery) => {
	const multipleSelectQuery = getSelectQuery;
	const queryResponse = await executeQuery(multipleSelectQuery);
	return queryResponse;
};

const getValue = async (getSelectQuery, value) => {
	const selectValueQuery = getSelectQuery;
	const queryResponse = await executeQuery(selectValueQuery);
	return queryResponse[0].value;
};

const escapeString = (str) => {
	const string = str ? str : "";
	return string.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
		switch (char) {
			case "\0":
				return "\\0";
			case "\x08":
				return "\\b";
			case "\x09":
				return "\\t";
			case "\x1a":
				return "\\z";
			case "\n":
				return "\\n";
			case "\r":
				return "\\r";
			case "%":
				return char;
			case '"':
			case "'":
			case "\\":
				return "\\" + char; // prepends a backslash to backslash, percent,
			// and double/single quotes
		}
	});
};

module.exports = {
  executeQuery,
  insert,
  update,
  destroy,
  getRow,
  getRows,
  getValue,
  escapeString
};
