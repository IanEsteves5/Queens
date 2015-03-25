function queensPosition() {
    this.position = shuffle([0, 1, 2, 3, 4, 5, 6, 7]);
    
    this.numberOfIntersections = function() {
        var result = 0;
        for(var i = 0 ; i < this.position.length-1 ; i++) {
            for(var j = i+1 ; j < this.position.length ; j++) {
                if(Math.abs(i-j)===Math.abs(this.position[i]-this.position[j]))
                    result++;
            }
        }
        return result;
    };
    
    this.merge = function(queensPosition2) {
        var result = new queensPosition();
        for(var i = 0 ; i < this.position.length ; i++) {
            if(i < this.position.length/2)
                result.position[i] = this.position[i];
            else
                result.position[i] = queensPosition2.position[i];
        }
        result.correctPosition();
        return result;
    };
    
    this.mutate = function() {
        var i = Math.floor(Math.random()*this.position.length);
        var j = Math.floor(Math.random()*this.position.length);
        var aux = this.position[i];
        this.position[i] = this.position[j];
        this.position[j] = aux;
    };
    
    this.correctPosition = function() {
        var missingNumbers = [];
        for(var i = 0 ; i < this.position.length ; i++) {
            var found = false;
            for(var j = 0 ; j < this.position.length ; j++) {
                if(this.position[j] === i) {
                    found = true;
                    break;
                }
            }
            if(!found)
                missingNumbers.push(i);
        }
        for(var i = 0 ; i < this.position.length - 1 ; i++) {
            var found = false;
            for(var j = i + 1 ; j < this.position.length ; j++) {
                if(this.position[i] === this.position[j]) {
                    found = true;
                    break;
                }
            }
            if(found)
                this.position[i] = missingNumbers.pop();
        }
    };
    
    this.info = function() {
        var normalizedPosition = this.position;
        var normalizedPosition = [];
        for(var i = 0 ; i < this.position.length ; i++) {
            normalizedPosition.push(this.position[i] + 1);
        }
        return "[" + normalizedPosition.toString() + "] " + this.numberOfIntersections()*2 + " intersections";
    };
    
    this.diagram = function() {
        var result = "<table>";
        for(var line = 0 ; line < this.position.length ; line++) {
            result += "<tr>";
            for(var col = 0 ; col < this.position.length ; col++){
                if(col === this.position[line])
                    result += "<td style='background-color:forestgreen;height:22px;width:22px'></td>";
                else
                    result += "<td style='background-color:oldlace;height:22px;width:22px'></td>";
            }
            result += "</tr>";
        }
        result += "</table>";
        return result;
    };
    
    this.copy = function() {
        result = new queensPosition();
        for(var i = 0 ; i < this.position.length ; i++) {
            result.position[i] = this.position[i];
        }
        return result;
    };
};

function geneticAlgorithm(positions) {
    var result = [];
    for(var i = 1 ; i < positions.length ; i += 2) {
        result.push(positions[i-1].merge(positions[i]));
        result.push(positions[i].merge(positions[i-1]));
    }
    var originalLength = positions.length;
    for(var i = 0 ; i < originalLength ; i++) {
        var mutatedPosition = result[i].copy();
        mutatedPosition.mutate();
        result.push(mutatedPosition);
    }
    for(var i = 0 ; i < positions.length ; i++) {
        result.push(positions[i]);
    }
    orderListOfPositions(result);
    var worstCase = result[result.length-1];
    result = result.slice(0, positions.length-1);
    result.push(worstCase);
    return result;
};

function orderListOfPositions(positions) {
    for(var i = 0 ; i < positions.length-1 ; i++) {
        for(var j = i+1 ; j < positions.length ; j++) {
            if(positions[i].numberOfIntersections() > positions[j].numberOfIntersections()){
                var aux = positions[i];
                positions[i] = positions[j];
                positions[j] = aux;
            }
        }
    }
}

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
