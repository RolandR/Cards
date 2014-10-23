function shuffle(list){

	var shuffledList = [];

	while(list.length > 0){
		shuffledList.push(list.splice(Math.floor(Math.random()*list.length), 1)[0]);
	}

	return shuffledList;
}
