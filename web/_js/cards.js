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

		selectedCards = [];
		
		for(var i in cards.sets){
			if(cards.sets[i].toggleButton.isToggled()){
				for(var a in cards.sets[i].cards){
					var card = cards.sets[i].cards[a];
					if(!(card instanceof Array)){
						selectedCards.push({
							 set: cards.sets[i]
							,isMulti: true
							,deck: cards
							,name: card.name
							,cards: card.cards
							,number: a
						});
					} else {
						selectedCards.push({
							 set: cards.sets[i]
							,isMulti: false
							,deck: cards
							,front: card[0]
							,back: card[1]
							,number: a
						});
					}
				}
			}
		}

		var shuffleCards = orderButton.isToggled();
		
		startQuiz(shuffleCards);
	}
}

function showSetsScreen(){
	document.getElementById("setScreen").style.display = "block";
	document.getElementById("quizScreen").style.display = "none";
	document.getElementById("menuButton").style.display = "none";
	document.getElementById("pageTitle").innerHTML = "Select Card Decks";
}

function startQuiz(shuffleCards){
	document.getElementById("setScreen").style.display = "none";
	document.getElementById("quizScreen").style.display = "block";
	var menuButton = document.getElementById("menuButton");
	menuButton.style.display = "inline-block";
	menuButton.onclick = showSetsScreen;
	
	var cardStack = selectedCards;
	if(shuffleCards){
		cardStack = shuffle(cardStack);
	}
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
			if(shuffleCards){
				cardStack = shuffle(cardStack);
			}
			wrongCards = [];
			pass++;
			passLength = cardStack.length;
		}
		
		document.getElementById("quiz").scrollTop = 0;
		
		progressBarEl.innerHTML = "Card "+(passLength - cardStack.length + 1)+" of "+passLength;
		progressBarEl.style.width = ((passLength - cardStack.length + 1) / passLength) * progressBarContainer.offsetWidth + "px";
		
		var card = cardStack[0];
		
		pageTitleEl.innerHTML = card.set.name + " - #"+ (~~(card.number) + 1);

		if(card.isMulti){ // Multi card

			document.getElementById("singleCard").style.display = "none";
			document.getElementById("multiCard").style.display = "block";

			if(card.name){
				document.getElementById("multiName").innerHTML = card.name;
				document.getElementById("multiName").style.display = "block";
			} else {
				document.getElementById("multiName").style.display = "none";
			}
			
			
			var multiCardsContainer = document.getElementById("multiCards");
			multiCardsContainer.innerHTML = "";

			var hiddenCount = card.cards.length;
			var multiCards = [];

			for(var i in card.cards){
				multiCards.push(new MultiCard(card.cards[i][0], card.cards[i][1], function(){
					hiddenCount--;
					if(hiddenCount <= 0){
						correctButton.disabled = false;
						wrongButton.disabled = false;
					}
				}));
			}
			
			
			
		} else { // Single card

			document.getElementById("singleCard").style.display = "block";
			document.getElementById("multiCard").style.display = "none";
		
			cardFrontEl.innerHTML = card.front;
			cardBackEl.innerHTML = card.back;
		}
	}

	function MultiCard(frontText, backText, onShow){
		var hidden = true;

		var front = document.createElement("p");
		front.className = "multiFront";
		front.innerHTML = frontText;
		
		var back = document.createElement("div");
		back.className = "multiBack";
		back.dataset.hidden = true;
		var backTitleEl = document.createElement("p");
		backTitleEl.className = "multiBackTitle";
		backTitleEl.innerHTML = "Show";
		var backTextEl = document.createElement("p");
		backTextEl.className = "multiBackText";
		backTextEl.innerHTML = backText;

		back.appendChild(backTitleEl);
		back.appendChild(backTextEl);

		back.onclick = function(){
			if(hidden){
				show();
				hidden = false;
				onShow();
			}
		}

		var multiCardsContainer = document.getElementById("multiCards");
		multiCardsContainer.appendChild(front);
		multiCardsContainer.appendChild(back);

		function show(){
			
			back.dataset.hidden = "false";

			backTitleEl.style.display = "none";
			backTextEl.style.display = "block";
		
		}
		
		return {
			 isHidden: function(){return hidden;}
			,show: show
		};
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


















