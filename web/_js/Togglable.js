function Togglable(parent, text, toggledText, onToggle){
	
	var element = null;
	var toggled = false;
	create(parent, text);
	
	function create(parent, text, toggledText){
		element = document.createElement("div");
		element.className = "dr-c-togglable";
		element.innerHTML = text;
		element.onclick = toggle;
		
		parent.appendChild(element);
	}
	
	function toggle(){
		if(toggled){
			toggled = false;
			if(toggledText){
				element.innerHTML = text;
			}
		} else {
			toggled = true;
			if(toggledText){
				element.innerHTML = toggledText;
			}
		}
		element.setAttribute("data-toggled", toggled);
		
		if(onToggle){
			onToggle();
		}
	}
	
	return{
		 isToggled: function(){return toggled;}
		,toggle: toggle
		,getElement: function(){return element;}
		,set: function(newValue){
			if(newValue != toggled){
				toggle();
			}
		}
	}
}