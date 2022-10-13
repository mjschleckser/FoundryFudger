Hooks.once('init', async function() {

});

Hooks.once('ready', async function() {

});

//// Prototype code
let evalRoll = Roll.prototype.evaluate; 
Roll.prototype.evaluate = function(){
	console.log('beans'); 
	evalRoll.apply(this, arguments);
}




/****FOUNDRY VTT CODE***/
/**
* Evaluate the roll asynchronously.
* A temporary helper method used to migrate behavior from 0.7.x (sync by default) to 0.9.x (async by default).
* @returns {Promise<Roll>}
* @private
*/
async _evaluate({minimize=false, maximize=false}={}) {
	
	// Step 0 - check if this roll has been marked for fudging
	// evaluate playerId, fudgedRollsLog, etc.
	
	
	// maybe we check which terms would need to be fudged to get a specific result?

	// Step 1 - Replace intermediate terms with evaluated numbers
	const intermediate = [];
	for ( let term of this.terms ) {
	  if ( !(term instanceof RollTerm) ) {
		throw new Error("Roll evaluation encountered an invalid term which was not a RollTerm instance");
	  }
	  if ( term.isIntermediate ) {
		await term.evaluate({minimize, maximize, async: true});
		this._dice = this._dice.concat(term.dice);
		term = new NumericTerm({number: term.total, options: term.options});
	  }
	  intermediate.push(term);
	}
	this.terms = intermediate;

	// Step 2 - Simplify remaining terms
	this.terms = this.constructor.simplifyTerms(this.terms);

	// Step 3 - Evaluate remaining terms
	for ( let term of this.terms ) {
	  if ( !term._evaluated ) await term.evaluate({minimize, maximize, async: true});
	}

	// Step 4 - Evaluate the final expression
	this._total = this._evaluateTotal();


	// Step 5 - if we didn't like our answer, get a new one
	
	
	// Step 6 - fudging cleanup. Remove marked roll from fudge log

return this;
}
