(function(){

    var elmLoadMore = document.getElementById('load-more');
        elmLoadMore.addEventListener('click', loadMore);
    var response = [];


    function loadMore(e) {
        var response = mapResponse(sortResponse(getRandomResponse()));
        var map = [0, 'half', '', 'double'];
        for (var i = 0; i < response.length; i++) {
            var originalSize = map[response[i].type];
            var elm = document.createElement('div');
            elm.innerHTML = response[i].value;
            elm.classList.add(response[i].align);
            if (originalSize !== '') {
                elm.classList.add(originalSize);
            }
            elmLoadMore.parentNode.insertBefore(elm, elmLoadMore);
        }
    }

    function mapResponse(response) {

        var positions = ['left', 'right', 'center']; // 0,1,2
        var positionCount = [0, 0, 0];
        var mappedResponse = [];

        var positionToFit = 0;
        var nextPosition = 1;

        var obj = {};
        var index;
        var extra = false;
        var rightCountForExtra = 0;
        var centerCountForExtra = 2;
        for (var i = 0; i < response.length; i++) {
            obj = response[i];
            obj.align = positions[positionToFit];
            obj.height = positionCount[positionToFit];
            positionCount[positionToFit] += obj.type;
            nextPosition = (positionToFit === 2) ? 0 : positionToFit + 1;

            if (positionToFit === 1 && (positionCount[0] > (positionCount[1] + rightCountForExtra))) {
                
                index = findItemtoFit(response, i+2, (positionCount[0] - (positionCount[1] + rightCountForExtra)))
                console.log(i, index, "add extra item in right", positionCount[0], positionCount[1]);
                if(index) {
                    extra = response[index]
                    extra.align = positions[1];
                    response.splice(index, 1);
                    console.log( 'sortInternal',  i+2, positionCount);
                    //response = sortResponse(response, i+2, positionCount);
                }
            }
            if (positionToFit === 2 && (positionCount[0] > (positionCount[2] + centerCountForExtra))) {
                index = findItemtoFit(response, i+1, (positionCount[0] - (positionCount[2] + centerCountForExtra)));
                console.log(i, index, "add extra item in center", positionCount[1], positionCount[2]);
                if(index) {
                    extra = response[index]
                    extra.align = positions[2];
                    response.splice(index, 1);
                    console.log( 'sortInternal',  i+1, positionCount);
                    //response = sortResponse(response, i+1, positionCount);
                }
            }

            mappedResponse.push(obj);
            if (extra) {
                positionCount[positionToFit] += extra.type;
                extra.height = positionCount[positionToFit];
                mappedResponse.push(extra);
                extra = false;

            }
            positionToFit = nextPosition;
        }
        console.log(mappedResponse);
        return mappedResponse;
    }

    function findItemtoFit(response, indexToStart, gap) {
        var itemIndexToFit = [0, 0, 0];
        for (var i = indexToStart; i < response.length; i++) {
            if(response[i].type == 1 && itemIndexToFit[0] === 0)
                itemIndexToFit[0] = i;
            if(response[i].type == 2 && itemIndexToFit[1] === 0)
                itemIndexToFit[1] = i;
            if(response[i].type == 3 && itemIndexToFit[2] === 0)
                itemIndexToFit[2] = i;
        }
        if(itemIndexToFit[2] && gap >= 2) {
            console.log('gap2', itemIndexToFit[2], itemIndexToFit[1], (itemIndexToFit[2] - itemIndexToFit[1]));
            return itemIndexToFit[2];
        } else if(itemIndexToFit[1]) {
            console.log('gap1', itemIndexToFit[1], itemIndexToFit[0], (itemIndexToFit[1] - itemIndexToFit[0]));
            return itemIndexToFit[1];
        } else if(itemIndexToFit[0])
            return itemIndexToFit[0];
        else
            return false;
    }


    function sortResponse(response, indexToStart, positionCount) {

        var positionCount = (typeof positionCount === "object") ? positionCount : [0, 0, 0];
        var indexToStart = (typeof indexToStart === "number") ? indexToStart : 0;
        var sortResponse = [];
        var positionToFit = 0;
        var sorted = false;
        var obj = {};

        for (var i = indexToStart; i < response.length; i++) {
            obj = {};
            obj.value = i + 1;
            obj.type = response[i];
            positionCount[positionToFit] += response[i];
            obj.height = positionCount[positionToFit];
            sorted = false;
            if (i > 0) {
                var obj1 = sortResponse[i - 1];
                if ((positionToFit === 1) && (obj1.height < obj.height)) {
                    sortResponse.splice((i - 1), 0, obj);
                    sorted = true;
                }
            }
            if (i > 1) {
                var obj2 = sortResponse[i - 2];

                if ((positionToFit === 2) && (obj2.height < obj.height)) {
                    sortResponse.splice((i - 2), 0, obj);
                    sorted = true;
                } else if (positionToFit === 2 && (obj1.height < obj.height)) {
                    sortResponse.splice((i - 1), 0, obj);
                    sorted = true;
                }
            }
            if (!sorted) {
                sortResponse.push(obj);
            }
            positionToFit = (positionToFit === 2) ? 0 : positionToFit + 1;
        }
        console.log('sortResult', JSON.stringify(sortResponse));
        return sortResponse;
    }


    function getRandomResponse() {

        for (var i = 0; i < 9; i++) {
            response.push(Math.floor((Math.random() * 3) + 1));
        }
        // return [2, 3, 1, 1, 1, 3, 3, 3, 2, 1];
        // return [1, 1, 3, 3, 2, 1, 2, 2, 2, 3];
        // return [3, 1, 1, 3, 1, 2, 2, 2, 2, 3];
        // return [2, 1, 1, 3, 3, 2, 1, 2, 1];
        // return [3, 3, 3, 3, 2, 2, 2, 1, 1];
        // return [1, 1, 2, 3, 3, 3, 3, 3, 2];
        // return [2, 1, 3, 3, 3, 2, 3, 3, 3];
        // return [2, 3, 2, 2, 2, 1, 3, 3, 1];
        // return [1, 1, 3, 1, 1, 1, 3, 3, 2];
        // return [1, 1, 3, 1, 1, 1, 3, 3, 2];
        // return [1, 2, 3, 1, 3, 3, 1, 1, 1];
        // return [2, 1, 1, 1, 3, 3, 3, 2, 2];
        response =  [2, 1, 1, 1, 1, 2, 1, 1, 3]
        console.log(response);
    }
})();

/*
        if (positionToFit === 1 && (positionCount[0] > (positionCount[1] + rightCountToAdd))) {
            index = i + 3;
            if (index < response.length) {
                extra = response[index];
                extra.align = positions[positionToFit];
                for (var j = index; j < response.length; j = j + 3) {
                    if (response[j + 3]) 
                        response.splice(j + 1, 0, response[j + 3]);
                    response.splice(j, 1);
                }
                rightCountToAdd = 2;
            }
        }

        if (((i + 2) === response.length ) && (positionToFit < 2) && (positionCount[0] > (positionCount[2] + 2))) {
            index = i + 1;
            extra = response[index];
            extra.align = positions[2];
            response.splice(index, 1);
        }
*/