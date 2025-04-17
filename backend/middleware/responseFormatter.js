function formatJson(response, data) {
	finalData = {}
	
	finalData['Version'] = '1.0.0';
	finalData['StatusCode'] = response.statusCode;

	if(!data){
		finalData['Data'] = []
		return finalData
	}
	
	if (data.hasOwnProperty('Status')) {
		finalData['Status'] = data.Status;
		delete data.Status;
	}

	if (!finalData.hasOwnProperty('Status')) {
		if ([200, 201, 202].includes(finalData['StatusCode'])) {
			finalData['Status'] = true
		} else {
			finalData['Status'] = false
		}
	}

	if (data.hasOwnProperty('Error')) {
		finalData['Error'] = data.Error;
		delete data.Error;
	}

	if (data.hasOwnProperty('Message')) {
		finalData['Message'] = data.Message;
		delete data.Message;
	}

	finalData['Data'] = data;
	
	if (Array.isArray(finalData['Data'])) {
		finalData['count'] = finalData['Data'].length
	}

	return finalData;
}

exports.responseFormatter = async function (request, response, next) {
	try {
		const oldJSON = response.json;
		response.json = (data) => {
			// For Async call, handle the promise and then set the data to ⁠ oldJson ⁠
			if (data && data.then != undefined) {
				// Resetting json to original to avoid cyclic call.
				return data.then((responseData) => {
					responseData = formatJson(response, responseData)
					response.json = oldJSON;
					console.log(request.method, request.originalUrl, response.statusCode)
					return oldJSON.call(response, responseData);
				}).catch((error) => {
					next(error);
				});
			} else {
				finalResponse = formatJson(response, data)
				response.json = oldJSON;
				response.headers = {
					...response.headers,
					"Access-Control-Allow-Origin": "*", // Required for CORS support to work
					"Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS 
				}
				console.log(request.method, request.originalUrl, response.statusCode)
				return oldJSON.call(response, finalResponse);
			}
		}
		next();
	} catch (error) {
		next(error);
	}
}