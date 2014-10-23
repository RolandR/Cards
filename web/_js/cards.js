buildSetsScreen(spanishCards);

var selectedCards = [];

function buildSetsScreen(cards){
	
	document.getElementById("pageTitle").innerHTML = "Select Card Decks";
	var deckNameHeader = document.getElementById("deckName");
	deckNameHeader.innerHTML = cards.name;
	var setsScreen = document.getElementById("sets");
	
	var orderButton = new Togglable(document.getElementById("setsFooter"), "Order: Sorted", "Order: Random");
	orderButton.getElement().className += " orderButton footerButton right";
	
	var startButton = document.getElementById("startButton");
	
	for(var i in cards.sets){
		var lengthStr = "";
		if(cards.sets[i].cards.length == 1){
			lengthStr = "<span>1 card</span>"
		} else {
			lengthStr = "<span>"+cards.sets[i].cards.length+" cards</span>"
		}
		cards.sets[i].toggleButton = new Togglable(setsScreen, cards.sets[i].name + lengthStr, "", updateSetSelections);
	}
	
	deckNameHeader.onclick = function(){
		var selectedSetCount = 0;
		for(var i in cards.sets){
			if(cards.sets[i].toggleButton.isToggled()){
				selectedSetCount++;
			}
		}
		
		for(var i in cards.sets){
			if(selectedSetCount > cards.sets.length / 2){
				cards.sets[i].toggleButton.set(false);
			} else {
				cards.sets[i].toggleButton.set(true);
			}
		}
	};
	
	function updateSetSelections(){
		var selectedSetCount = 0;
		for(var i in cards.sets){
			if(cards.sets[i].toggleButton.isToggled()){
				selectedSetCount++;
			}
		}
		if(selectedSetCount > 0){
			startButton.disabled = false;
		} else {
			startButton.disabled = true;
		}
	}
	
	startButton.onclick = function(){
		if(startButton.disabled){
			return false;
		}
		
		for(var i in cards.sets){
			if(cards.sets[i].toggleButton.isToggled()){
				for(var a in cards.sets[i].cards){
					var card = cards.sets[i].cards[a];
					selectedCards.push({
						 set: cards.sets[i]
						,deck: cards
						,front: card[0]
						,back: card[1]
						,number: a
					});
				}
			}
		}
		
		startQuiz();
	}
}

function showSetsScreen(){
	document.getElementById("setScreen").style.display = "block";
	document.getElementById("quizScreen").style.display = "none";
	document.getElementById("pageTitle").innerHTML = "Select Card Decks";
}

function startQuiz(){
	document.getElementById("setScreen").style.display = "none";
	document.getElementById("quizScreen").style.display = "block";
	
	var cardStack = selectedCards;
	var correctCards = [];
	var wrongCards = [];
	
	var cardNameEl = document.getElementById("questionName");
	var cardFrontEl = document.getElementById("cardFront");
	var cardBackEl = document.getElementById("cardBack");
	var hiddenCardEl = document.getElementById("hiddenCard");
	hiddenCardEl.onclick = showSolution;
	
	var pageTitleEl = document.getElementById("pageTitle");
	
	var correctButton = document.getElementById("correctButton");
	correctButton.onclick = wasCorrect;
	var wrongButton = document.getElementById("wrongButton");
	wrongButton.onclick = wasWrong;
	
	var progressBarEl = document.getElementById("quizProgressBar");
	var progressBarContainer = document.getElementById("quizProgress");
	
	var pass = 0;
	var passLength = cardStack.length;
	
	next();
	
	function next(){
		hiddenCardEl.dataset.hidden = true;
		correctButton.disabled = true;
		wrongButton.disabled = true;
		
		if(cardStack.length == 0){
			if(wrongCards.length == 0){
				showSetsScreen();
				return;
			}
			cardStack = wrongCards;
			wrongCards = [];
			pass++;
			passLength = cardStack.length;
		}
		
		progressBarEl.innerHTML = "Card "+(passLength - cardStack.length + 1)+" of "+passLength;
		progressBarEl.style.width = ((passLength - cardStack.length + 1) / passLength) * progressBarContainer.offsetWidth + "px";
		console.log(progressBarEl.style.width);
		
		var card = cardStack[0];
		
		pageTitleEl.innerHTML = card.set.name + " - #"+ (~~(card.number) + 1);
		
		cardFrontEl.innerHTML = card.front;
		cardBackEl.innerHTML = card.back;
	}
	
	function showSolution(){
		hiddenCardEl.dataset.hidden = false;
		
		correctButton.disabled = false;
		wrongButton.disabled = false;
		
	}
	
	function wasCorrect(){
		correctCards.push(cardStack.shift());
		next();
	}
	
	function wasWrong(){
		wrongCards.push(cardStack.shift());
		next();
	}
}



















