$.ajaxSetup({
	headers: {
		'x-csrf-token': config.csrf_token,
	},
	beforeSend: function (xhr, settings) {},
});
const baseUrl = config.relative_path + '/api/v3';
$(document).ajaxComplete(function (event, request, settings) {});
$(document).ajaxError(function (event, request, settings) {
	// console.log(event, request, settings)
});
$(document).ajaxSend(function (event, request, settings) {
	// console.log(event, request, settings)
});
$(document).ajaxStart(function (event, request, settings) {
	//   console.log(event, request, settings)
});
$(document).ajaxStop(function (event, request, settings) {
	// console.log(event, request, settings)
});
$(document).ajaxSuccess(function (event, request, settings) {
	// console.log(event, request, settings)
});

async function doAjax(data) {
	let url = '';
	if (!data.isCustom) {
		url = baseUrl + data.url;
	} else {
		url = config.relative_path + data.url;
	}
	if (data.url.startsWith('/')) {
		data.url = url;
		console.log(data.url);
		data.url = data.url.replace('http:', location.protocol);
	}
	return $.ajax(data);
}

// doAjax({
//     type: 'POST',
//     url: url,
//     data: formData,
//     cache: false,
//     contentType: false,
//     processData: false,
// }).then(function (res) {

// }).catch(function (error) {

// }).finally(function () {

// });

// doAjax({
//     type: 'POST',
//     url: url,
//     method: "POST",
//     dataType: 'json',
//     contentType: 'application/json',
//     data: JSON.stringify(data),
// }).then(function (response) {

// }).catch(function (error) {

// }).finally(function () {

// });

// doAjax({
//     type: 'GET',
//     url: url,
//     data: {
//         id: id
//     },
// }).then(function (response) {

// }).catch(function (error) {

// }).finally(function () {

// });
