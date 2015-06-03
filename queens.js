/*
 * Queens
 * By Ian Esteves do Nascimento, 2014
 */

function queensPosition() { // creates a new board to be used in the genetic algorithm
    this.position = shuffle([0, 1, 2, 3, 4, 5, 6, 7]); // 8 random positions on the board
                                                       // the array index is the row, the content is the column
                                                       // this representation guarantees that no two queens have the same row or column

    this.numberOfIntersections = function() { // calculates how many queens are in the same diagonal as another queen
        var result = 0;
        for(var i = 0 ; i < this.position.length-1 ; i++) {
            for(var j = i+1 ; j < this.position.length ; j++) {
                if(Math.abs(i-j)===Math.abs(this.position[i]-this.position[j]))
                    result++;
            }
        }
        return result;
    };
    
    this.merge = function(queensPosition2) { // combines with another board to create a new one
        var result = new queensPosition(); // creates a new board
        for(var i = 0 ; i < this.position.length ; i++) {
            if(i < this.position.length/2)
                result.position[i] = this.position[i]; // first 4 queens come from the current board
            else
                result.position[i] = queensPosition2.position[i]; // last 4 queens come from the other board
        }
        result.correctPosition(); // checks if two queens are on the same column as a result of the combination
        return result;
    };
    
    this.mutate = function() { // swaps the columns of two random queens
        var i = Math.floor(Math.random()*this.position.length);
        var j = Math.floor(Math.random()*this.position.length);
        var aux = this.position[i];
        this.position[i] = this.position[j];
        this.position[j] = aux;
    };
    
    this.correctPosition = function() { // verifies that no two queens are in the same column
        var missingNumbers = [];
        for(var i = 0 ; i < this.position.length ; i++) { // columns
            var found = false;
            for(var j = 0 ; j < this.position.length ; j++) { // rows
                if(this.position[j] === i) {
                    found = true;
                    break;
                }
            }
            if(!found) // no queen is on this column
                missingNumbers.push(i);
        }
        for(var i = 0 ; i < this.position.length - 1 ; i++) { // queen 1
            var found = false;
            for(var j = i + 1 ; j < this.position.length ; j++) { // queen 2
                if(this.position[i] === this.position[j]) { // queen 1 and queen 2 are on the same column
                    found = true;
                    break;
                }
            }
            if(found) // moves queen 1 to the empty column
                this.position[i] = missingNumbers.pop();
        }
    };
    
    this.info = function() { // generates a string with the positions of the queens on the board
        var normalizedPosition = this.position;
        var normalizedPosition = [];
        for(var i = 0 ; i < this.position.length ; i++) {
            normalizedPosition.push(this.position[i] + 1);
        }
        return "[" + normalizedPosition.toString() + "] " + this.numberOfIntersections()*2 + " intersections";
    };
    
    this.diagram = function() { // generates a html table with a drawing of the board
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
    
    this.copy = function() { // creates another instance of this object
        result = new queensPosition();
        for(var i = 0 ; i < this.position.length ; i++) {
            result.position[i] = this.position[i];
        }
        return result;
    };
};

function geneticAlgorithm(positions) { // does one iteration of the genetic algorithm
    var result = [];
    for(var i = 1 ; i < positions.length ; i += 2) { // combines the boards to create the next generation
        result.push(positions[i-1].merge(positions[i]));
        result.push(positions[i].merge(positions[i-1]));
    }
    var originalLength = positions.length;
    for(var i = 0 ; i < originalLength ; i++) { // random mutations
        var mutatedPosition = result[i].copy();
        mutatedPosition.mutate();
        result.push(mutatedPosition);
    }
    for(var i = 0 ; i < positions.length ; i++) { // adds the original boards to the result
        result.push(positions[i]);
    }
    orderListOfPositions(result); // orders by number of intersections
    var worstCase = result[result.length-1];
    result = result.slice(0, positions.length-1); // separates the best results
    result.push(worstCase); // adds back the worst result
    return result;
};

function orderListOfPositions(positions) { // orders a list of boards by number of intersections
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
