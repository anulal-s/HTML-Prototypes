(function(){

    var elmLoadMore = document.getElementById('load-more');
        elmLoadMore.addEventListener('click', loadMore);
    var response = [];
    var mappedResponse = [];
    var mapCount = [0, 0, 0];
    var positions = ['left', 'right', 'center']; // 0,1,2
    var mapPosition = 0;
    
    var nextPosition = 1;

    function loadMore(e) {
        getRandomResponse();
        sortResponse();
        mapResponse();
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

    function mapResponse() {

        var obj = {};
        var index;
        var extra = false;
        var rightCountForExtra = 0;
        var centerCountForExtra = 2;
        for (var i = 0; i < response.length; i++) {
            obj = response[i];
            obj.align = positions[mapPosition];
            obj.height = mapCount[mapPosition];
            mapCount[mapPosition] += obj.type;
            nextPosition = (mapPosition === 2) ? 0 : mapPosition + 1;

            if (mapPosition === 1 && (mapCount[0] > (mapCount[1] + rightCountForExtra))) {
                
                index = findItemtoFit(i+2, (mapCount[0] - (mapCount[1] + rightCountForExtra)))
                console.log(i, "add extra item in right from", index, "gap", mapCount[0] - mapCount[1]);
                if(index) {
                    extra = response[index]
                    extra.align = positions[1];
                    response.splice(index, 1);
                    console.log( 'sortInternal',  i+2, mapCount);
                    sortResponse(i+2);
                }
            }
            if (mapPosition === 2 && (mapCount[0] > (mapCount[2] + centerCountForExtra))) {
                index = findItemtoFit(i+1, (mapCount[0] - (mapCount[2] + centerCountForExtra)));
                console.log(i, "add extra item in center from", index, "gap", mapCount[0] - mapCount[2]);
                if(index) {
                    extra = response[index]
                    extra.align = positions[2];
                    response.splice(index, 1);
                    console.log( 'sortInternal',  i+1, mapCount);
                    sortResponse(i+1);
                }
            }

            mappedResponse.push(obj);
            if (extra) {
                mapCount[mapPosition] += extra.type;
                extra.height = mapCount[mapPosition];
                mappedResponse.push(extra);
                extra = false;

            }
            mapPosition = nextPosition;
        }
        console.log('mappedResponse', mappedResponse.length, mappedResponse);
        response =  mappedResponse;
    }

    function findItemtoFit(indexToStart, gap) {
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


    function sortResponse(indexToStart) {

        var sorted = false;
        var obj = {};
        var prevPosition1, prevPosition2;
        var sortPosition = 0;
        var sortCount = [0, 0, 0];
        if(typeof indexToStart === "number") {
            var internalSort = true;
            //sortPosition = 0;
        } else {
            indexToStart = 0;
            //sortPosition = mapPosition;
        }
        
        for (var i = indexToStart; i < response.length; i++) {
           
            obj = response[i];
            obj.align = positions[sortPosition];
            sortCount[sortPosition] += response[i].type;
            sorted = false;
            if (i > 0) {
                prevPosition1 = ( sortPosition === 0 ) ? 2 : sortPosition-1; 
                if ((sortPosition === 1) && (sortCount[prevPosition1] < sortCount[sortPosition])) {
                    response.splice((i - 1), 0, obj);
                    sorted = true;
                }
            }
            if (i > 1) {
                prevPosition2 = ( prevPosition1 === 0 ) ? 2 : prevPosition1-1; 
                if ((sortPosition === 2) && (sortCount[prevPosition2] < sortCount[sortPosition])) {
                    response.splice((i - 2), 0, obj);
                    sorted = true;
                } else if (sortPosition === 2 && (sortCount[prevPosition1] < sortCount[sortPosition])) {
                    response.splice((i - 1), 0, obj);
                    sorted = true;
                }
            }
            if (sorted)
                response.splice(i+1, 1);
            else 
                response[i] = obj;
            sortPosition = (sortPosition === 2) ? 0 : sortPosition + 1;
        }
        console.log('sortResult', response.length, response);
    }


    function getRandomResponse() {

        response = [];
        mappedResponse = [];
        mapPosition = 0;
        var random = [];
        for (var i = 0; i < 12; i++) {
            random.push(Math.floor((Math.random() * 3) + 1));
        }

        //random = [3, 3, 2, 1, 2, 3, 2, 2, 2];
        console.log('getRandomResponse', random.length, random);

        var obj;
        var rPositions = ['left', 'right', 'center']; // 0,1,2
        var rPosition = 0;
        for (var i = 0; i < random.length; i++) {
            obj = {};
            obj.value = i + 1;
            obj.type = random[i];
            obj.align = rPositions[rPosition];
            response.push(obj);
            rPosition = (rPosition === 2) ? 0 : rPosition + 1;
        }
    }

})();
