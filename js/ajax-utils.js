(function (global){
	var ajaxUtils = {};

	//returns an Http request object
	function getRequestObject(){
		if(global.XMLHttpRequest){
			return (new XMLHttpRequest());
		}
		else if (global.ActiveObject){
			return (new ActiveObject("Microsoft.XMLHTTP"));
		}
		else{
			global.alert("Ajax is not support!");
			return null;
		}
	}


	//make an Ajax GET Request to 'requestUrl'
	ajaxUtils.sendGetRequest = function (requestUrl, responseHandler, isJasonResponse){
		var request = getRequestObject();
		request.onreadystatechange = function(){
			handleResponse(request, responseHandler, isJasonResponse);
		};
		request.open("GET", requestUrl, true);
		request.send(null); //for POST ONLY
	};

	// Only calls user provided 'responseHandler'
	// function if response is ready
	// and not an error
	function handleResponse(request, responseHandler, isJasonResponse){
		if((request.readyState == 4) && (request.status == 200)){
			if(isJasonResponse == undefined){
				isJasonResponse = true;
			}

			if(isJasonResponse){
				responseHandler(JSON.parse(request.responseText));
			}
			else{
				responseHandler(request.responseText);
			}
		}
	}

	global.$ajaxUtils = ajaxUtils;

})(window);