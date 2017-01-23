var elmLoadMore = document.getElementById('load-more');
var elmContainer = document.getElementById('container');
var nodes = elmContainer.getElementsByTagName('div');
var map = [0, 'half', '', 'double'];

elmLoadMore.addEventListener('click',loadMore )

function loadMore (e) {

	var response = mapResponse(getRandomResponse());

	for(i=0; i<10;i++) {
		var orginalSize = map[response[i].type];
		var elm = document.createElement('div')
		elm.innerHTML = response[i].value;
		elm.classList.add(response[i].allign);
		if(orginalSize !== '')
			elm.classList.add(orginalSize);

		elmLoadMore.parentNode.insertBefore(elm, elmLoadMore);
	}
}


function mapResponse(response) {
	
	var postions = ['left', 'right' , 'center']; // 0,1,2
	var postionCount = [0, 0, 0]
	var mappedResponse = [];
	var postionToFit = 0;
	var swith = 0;
	var obj = {};

	for(i=0; i<10;i++) {
		obj = {};
		obj.value = i+1;
		obj.type = response[i];
		nextPosition = ( postionToFit === 2 ) ? 0 : postionToFit+1; 	
		prevPosition = ( postionToFit === 0 ) ? 2 : postionToFit-1; 
 if(postionToFit === 1 && (postionCount[postionToFit] <= postionCount[prevPosition]))  {
			obj.allign = postions[postionToFit];	
			postionCount[postionToFit] += response[i];
			console.log(i, response[i], postionCount[postionToFit], obj.allign);
		} else if((postionCount[postionToFit] < postionCount[nextPosition]) || (i == 0)) {
			obj.allign = postions[postionToFit];	
			postionCount[postionToFit] += response[i];
			console.log(i, response[i], postionCount[postionToFit], obj.allign);
			postionToFit = nextPosition;	
		} else {
			obj.allign = postions[nextPosition];
			postionCount[nextPosition] += response[i];
			console.log(i, response[i], postionCount[postionToFit], obj.allign);
			postionToFit = ( nextPosition == 2 ) ? 0 : nextPosition+1; 
		}
		mappedResponse.push(obj);
	}
	console.log(mappedResponse);
	return mappedResponse;
}


function getRandomResponse() {
	var response = []
	for(i=0; i<10;i++) {
		response.push(Math.floor((Math.random() * 3) + 1));
	}
	console.log(response);
	//return [2, 3, 1, 1, 1, 3, 3, 3, 2, 1];
	//return [1, 1, 3, 3, 2, 1, 2, 2, 2, 3];
	return [3, 1, 1, 3, 1, 2, 2, 2, 2, 3];
	return response;
}

