// Section that takes care of the events
document.addEventListener('DOMContentLoaded', function() {
    const guessInput = document.getElementById('guess');
    const fireButton = document.getElementById('firebutton');
    fireButton.disabled  = true;

    guessInput.addEventListener('input', function() {
    fireButton.disabled = guessInput.value.length !== 2;
    });

  
    fireButton.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent form submission behavior of the button 
  
      const guess = guessInput.value;
      controller.processGuess(guess);
  
      guessInput.value ="";
      fireButton.disabled  = true;
    });

    guessInput.addEventListener('keyup', function(event){
        if(!fireButton.disabled){
             if(event.key === 'Enter' ){
                fireButton.click(event);
                guessInput.value = "";
                fireButton.disabled  = true;
                return false ; // do not submit form after fire button has been executed 
        } 
        }    
        return false ; 
    })

  });
  



// VIEW: Deals with all displaying, calls by the model to display the activity 
var view ={
    displayMessage : function(msg){
        document.getElementById('messageArea').innerHTML = msg
    },
    displayHit : function(location){
        var location1 = document.getElementById(location);
        if(location1){
            location1.classList.add("hit");
      }
      else{
        console.log('Element not found ')
      }
      
    },
    displayMiss : function(location){
        var location1 = document.getElementById(location);
        if(location1){
           location1.classList.add("miss");
        }
        else{
          console.log('Element not found ')

    }
    }
}

//CONTROLLER : Keeps track of the users guess , procees the guess and passes it to the model 
var controller ={
    guesses: 0,

    processGuess: function(guess){
        var location = this.parseGuess(guess);
        if (location){
                this.guesses ++;
                var hit = model.fire(location);
            
                if( hit && model.numShips === model.shipSunk)
                {
                    view.displayMessage(`You sank all battleship, in ${this.guesses} guesses`)
                    console.log(`You sank all battleship, in ${this.guesses} guesses`)
            }
            }
    },

    parseGuess : function(guess){
        const arrayColumn = ['A', 'B', 'C', 'D' , 'E', 'F', 'G'];
        var firstChar = guess.charAt(0);
        var secondChar = guess.charAt(1);
        var firstCharNumber = arrayColumn.indexOf(firstChar.toUpperCase());
        console.log(guess)
        console.log(firstCharNumber+secondChar)
        
        //validation firstChar and secondChar has to be 0 -6
        if (guess === null || guess.length !== 2) {
            alert("Oops, please enter a letter and a number on the board.");
}
        if  (isNaN(firstCharNumber) || isNaN(secondChar) ){
            alert("Not a valid guess [A0-G6] ");
        }
        else if((firstCharNumber < 0 )|| (secondChar < 0 )|| (secondChar >= model.boardSize )||(firstCharNumber >= model.boardSize)){
            alert('This is off the board');
        }    
        else{
            //If the guess is valid, fire!
            return (firstCharNumber + secondChar);
        }

        return null;
    }
}

// MODEL:  Takes care of the state of the game

var model ={

boardSize: 7,
numShips: 3,
shipLength: 3, // a ship is in 3 location , has to guess the 3 location to sink the ship 
shipSunk: 0,
ships :[
{ locations: [0], hits: ["", "", ""] },
{ locations: [0], hits: ["", "", ""] },
{ locations: [0], hits: ["", "", ""] }],

fire: function(guess) {
    for (let i = 0; i < this.numShips; i++) {
        var ship = this.ships[i];
        console.log(`This is the ship location ${i} ${this.ships[i].locations}`);
        
        var index = ship.locations.indexOf(guess);
        var sank_before = ship.hits[i] === 'hit'
        if(sank_before)
        {
            view.displayMessage("Hit before, try anothe guess !");
            return false
        }
        if (index >= 0 && !sank_before) {
            ship.hits[index] = "hit";
            view.displayHit(guess);

            if (this.isSunk(ship)) {
                view.displayMessage(`HIT, You sank my battleship ${i}!`);
                 this.shipsSunk++;
            } else {
                view.displayMessage("HIT!");
            }
            return true;
        }
    }
    
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false;
},

isSunk : function(ship){
   var is_sunk =  ship.hits.every(x => x === "hit") //if all ship location has been hit return true
   return is_sunk;
    },

generateShipLocations: function(){
    var location ;
    for (var i =0; i< this.numShips; i++){
        do{
            location = this.generateShip()
        }
        while(this.collision(location));
        var ship= this.ships[i]
        ship.locations = location;

    }
},

collision: function(location){
   
    for(var i =0; i < this.numShips; i++){
       var ship= this.ships[i]
        for ( var j =0; j < this.numShips; j++){
            if (ship.locations.indexOf(location[j]) >=0){
                return true;
            }
        }
      
    }
    return false;
},

generateShip: function(){    
    var direction = Math.floor(Math.random()*2)
    var row, col;

    if(direction === 1) {
 //One for horizontal ship 

        row = Math.floor(Math.random()* this.boardSize);
        col = Math.floor(Math.random()* (this.boardSize-this.shipLength))

    }
    else{
//Zero for vertical ship

        col = Math.floor(Math.random()* this.boardSize);
        row = Math.floor(Math.random()* (this.boardSize-this.shipLength))
    }


    var newShipLocations =[];

    for(var i=0; i < this.shipLength; i++){
        if(direction === 1) {
            //One for horizontal ship 
            newShipLocations.push(row + "" + (col+i));
               }
        else{
           //Zero for vertical ship
           newShipLocations.push((row+i)+ "" + col);
               }
           
    }

return newShipLocations;
}

}




model.generateShipLocations();



