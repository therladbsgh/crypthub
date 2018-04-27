// This runs bots
//
// We wrap bot calls so that we can insert the time.
//
// For now this is just to demonstrate how we do this
//
//
// Assume the following is done for all minutes in time

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// This is the function we wish to wrap.  It can be defined anywhere
// Assume it does something like getting the price at at time
var doThing = function(){
  console.log(...arguments)
}

// This is our wrapper to wrap thinggs
var wrap = function(someFunction){
  var wrappedFunction = function(){
    //var args = [...arguments].splice(0)
    //console.log(`You're about to run a function with these arguments: \n     ${args}`)
    var time = "some time";
    return someFunction(...arguments, time)
  }
  return wrappedFunction
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    //rawFile.open("GET", file, false);
    rawFile.open("GET", 'file:///Users/Felix/Desktop/2015:16:17BROWN/WebApps/crypthub/src/backend/otherTradingBot.js', false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
	    //console.log(rawFile.status);
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;

		/*var script;

		scriptFile.open('r');
		script = scriptFile.read();
		scriptFile.close();*/
		//console.log(allText);

		eval(allText);
		console.log(eval("1+1"));
            }
        }
    }
    rawFile.send(null);
}

// Commands
// getPrice
// buy
// sell
// own
// getMemoryIndex
// setMemoryIndex

doThing = wrap(doThing)

//doThing('one', {two:'two'}, 3)



// Now run script
//var scriptFile = readTextFile('./otherTradingBot.txt')
var scriptFile = readTextFile('file:///Users/Felix/Desktop/2015:16:17BROWN/WebApps/crypthub/src/backend/otherTradingBot.txt')

