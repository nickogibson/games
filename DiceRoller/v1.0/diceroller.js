
$(document).ready(function(){

/* Thanks for checking out this little diceroller app. Try it in action on Nickogibson.github.io/games.io/	 */
	
	
// A class to make a dungeon dice.
    function dice(diceType){
		this.number = 0;
		this.name = this.number+"d"+diceType;
		this.roll = function(){
			if(this.number > 1){
				var total= 0;
				for(var x=1 ; x<=this.number; x++){
					var random= Math.floor((Math.random()*diceType)+1);
					total+= random;
				}
				$("li#rolling").prepend("<li>"+this.name+": You roll a <b>" +total+"</b></li>");
			}
			else{
				if(this.number > 0){
				var random= Math.floor((Math.random()*diceType)+1);
				$("li#rolling").prepend("<li>"+this.name+": You roll a <b>" +random+"</b></li>");
				}
				else{
					return false;
				}
			}
		};
	}	 
	 
	//Making each Dice
	d4 = new dice(4);
	d6 = new dice(6);
	d8 = new dice(8);
	d10 = new dice(10);
	d12 = new dice(12);
	d20 = new dice(20);
	
// HTML Integration	
	
	// Adding dice to hand
	var d4x = 0;
	$("#d4").click(function(){
		if(d4x<20){
			d4x++;
			d4.number+= 1;
			d4.name = d4x+"d4";
			$("td#first").html(d4.name+"  " );		
		}
	});
	
// Quickroll one dice
	$('#qd4').click(function(){
		d4.number = 1;
		d4.name = "1d4";
		$("li#rolling").prepend("<hr>");
		d4.roll();
	// return the value to number of dice in hand
		d4.number= d4x;
		d4.name = d4x+"d4";
	});

// repeated for all dice types
	
	var d6x = 0;
	$("#d6").click(function(){
		if(d6x<20){
			d6x++;
			d6.number+= 1;
			d6.name = d6x+"d6";
			$("td#second").html(d6.name+ "  ");
		}	
	});
	$('#qd6').click(function(){
		d6.number = 1;
		d6.name = "1d6";
		$("li#rolling").prepend("<hr>");
		d6.roll();
		d6.number= d6x;
		d4.name = d4x+"d6";
	});
	
	var d8x = 0;
	$("#d8").click(function(){
		if(d8x<20){
			d8x++;
			d8.number+= 1;
			d8.name = d8x+"d8";
			$("td#third").html(d8.name+"  " );			
		}	
	});
	
	$('#qd8').click(function(){
		d8.number = 1;
		d8.name = "1d8";
		$("li#rolling").prepend("<hr>");
		d8.roll();
		d8.number= d8x;
		d8.name = d8x+"d8";
	});
	
	var d10x = 0;
	$("#d10").click(function(){
		if(d10x<20){
			d10x++;
			d10.number+= 1;
			d10.name = d10x+"d10";
			$("td#fourth").html(d10.name+"  " );			
		}	
	});
	
	$('#qd10').click(function(){
		d10.number = 1;
		d10.name = "1d10";
		$("li#rolling").prepend("<hr>");
		d10.roll();
		d10.number= d10x;
		d10.name = d10x+"d10";
	});
	
	var d12x = 0;
	$("#d12").click(function(){
		if(d12x<20){
			d12x++;
			d12.number+= 1;
			d12.name = d12x+"d12";
			$("td#fifth").html(d12.name+"  " );			
		}
	});
	
	$('#qd12').click(function(){
		d12.number = 1;
		d12.name = "1d12";
		$("li#rolling").prepend("<hr>");
		d12.roll();
		d12.number= d12x;
		d12.name = d12x+"d12";
	});
	
	var d20x = 0;
	$("#d20").click(function(){
		if(d20x<20){
			d20x++;
			d20.number+= 1;
			d20.name = d20x+"d20";
			$("td#sixth").html(d20.name+"  " );		
		}
	});
	$('#qd20').click(function(){
		d20.number = 1;
		d20.name= "1d20";
		$("li#rolling").prepend("<hr>");
		d20.roll();
		d20.number= d20x;
		d20.name = d20x+"d20";
	});
	
//Roll Button - Clear Button
		$('.rButton').click(function(){
			$("li#rolling").prepend("<hr>");
			d4.roll();
			d6.roll();
			d8.roll();
			d10.roll();
			d12.roll();
			d20.roll();
		});
		
		$('.clear').click(function(){
			d4.number = 0;
			d4x = 0;
			$("td#first").html(" " );
			d6.number = 0;
			d6x = 0;
			$("td#second").html(" " );
			d8.number = 0;
			d8x = 0;
			$("td#third").html(" " );
			d10.number = 0;
			d10x = 0;
			$("td#fourth").html(" " );
			d12.number = 0;
			d12x = 0;
			$("td#fifth").html(" " );
			d20.number = 0;
			d20x = 0;
			$("td#sixth").html(" " );
		});
});

 //CSS Magic
	 $(".button").hover(function() {
		 $(this).addClass("buttonHover");
		 },
		 function(){
	 $(this).removeClass("buttonHover");
		 });
