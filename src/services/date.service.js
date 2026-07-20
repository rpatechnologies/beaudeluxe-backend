const moment = require("moment");

const dateFormat = (date) => date ? moment(date).format("YYYY-MM-DD") : null;
const dateFormatTwo = (date) => date ? moment(date).format("DD/MMM/YYYY") : null;

const formatDateInDmy = (date) => {
    return moment(date).format("DD-MM-YYYY")
} 

const formatDateInMdy = (date) => {
	const year = date.getFullYear();
	const month = date.getMonth();
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const monthString = months[month];
	const datess = date.getDate();
	return monthString + " " + datess + ", " + year;
};

module.exports = {
    dateFormat,
	dateFormatTwo,
    formatDateInDmy,
    formatDateInMdy
}