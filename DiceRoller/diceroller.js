var windowWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
var widened = false;
var modsForm; var modsWrapper;
var modsButton;
var diceNum =0; var diceType= 0;  //number of different dice, for sfx
var audio =true;
var dice1Audio; var dice2Audio; var dice3Audio; var dice4Audio; var dice5Audio;
var diceAudio = [];
var showRoll= (diceNum > 0 );
var d4 =null; var d6 =null; var d8=null; var d10=null; var d12=null;var d20=null;
var d4Mod =0;
var d6Mod =0; var d8Mod=0; var d10Mod=0; var d12Mod=0; var d20Mod=0;
var d4Form;var d6Form;var d8Form;var d10Form;var d12Form;var d20Form;
var Players=[];
var lastName ="Hand"; //last player name entered
var rollsCount;
var Name;

var hrNode;  //the last roll
//HandName = document.getElementById("handName");
window.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        var currentName=Name= document.getElementById("handName").innerHTML;
        saveHand(currentName);
        document.getElementById("handName").blur();
    }
});

class Player {

  constructor(name) {
    this.name = name;
    this.d4 = d4;  //set the dice to the current hand
    this.d6=d6; this.d8=d8; this.d10=d10; this.d12=d12; this.d20=d20;
    this.d4Mod=d4Mod;
    this.d6Mod=d6Mod; this.d8Mod=d8Mod; this.d10Mod=d10Mod; this.d12Mod=d12Mod; this.d20Mod=d20Mod;
    Players.push(this);
      Cookies.set("players", Players , { expires: 7000 });
        savedNotif();
    console.log(this);

  }

}


function saveHand(_Name) {
    //Name= document.getElementById("handName").innerHTML;
    //var _Name = Name;
    if(_Name == null || _Name ==""){

            document.getElementById("handName").innerHTML = lastName;

     return;
    }
    if( Players.find(x => x.name === _Name)){

        //d4Mod=_player.d4Mod;
        console.log("Loading player: "+_Name);
        fillHand(_Name);
        return;
    }


    //new player and Load player
    else{
        var newPlayer = new Player(_Name);
        Name= _Name;
        console.log(newPlayer);

        addPlayer(_Name);
        lastName=_Name;
        savedNotif();

    }

}


function addPlayer(PlayerName){

        var playerList = document.getElementById("players");
        var playerDiv= document.createElement("div");
        playerDiv.className= "playerDiv";
        var playerNode = document.createElement("div");
        var line = document.createElement("hr");
        var deleter = document.createElement('div');
        line.id=PlayerName;

        if(Players.length > 1){
            playerList.appendChild(line);
        }
            playerList.appendChild(playerDiv);
            deleter.className='deleter';
            deleter.id=PlayerName;
            deleter.innerHTML= "❌";
            playerNode.innerHTML= PlayerName;
            playerNode.id= PlayerName;
            playerDiv.id=PlayerName;
            playerNode.className="playerNode"

            playerDiv.appendChild(playerNode);
            playerDiv.appendChild(deleter);
            //Load Player
            playerNode.onclick=function(){
                clearHand();
                document.getElementById("handName").innerHTML = this.innerHTML;
                //var _name = PlayerName;
                var _player= Players.find(x => x.name === PlayerName);
             //   console.log(_player);
                fillHand(PlayerName);
                d4Form.value=d4Mod; d6Form.value=d6Mod; d8Form.value=d8Mod; d10Form.value=d10Mod;
                d12Form.value=d12Mod; d20Form.value=d20Mod;
                if(windowWidth <1057 || widened)closeP();
                Cookies.set("lastName",lastName, {expires:100});
            };
            deleter.onclick=function(){
                var _name = PlayerName;
                var _player= Players.find(x => x.name === _name);
                var playersDiv = document.getElementById(_name);
                playersDiv.remove();
                if(document.getElementById(_name)!= null){
                playersDiv = document.getElementById(_name);
                                playersDiv.remove();
                }

                var index = Players.indexOf(_player);
                if (index > -1) {
                  Players.splice(index, 1);
                  Cookies.set("players", Players , { expires: 7000 });
                }
                if(lastName ==_name && Players.length > 0){
                lastName = Players[Players.length-1].name;
                Cookies.set("lastName",lastName, {expires:100});
                }
                if(Players.length <=0){
                Cookies.remove("lastName");
                }
                else{lastName = "Hand"}
            };

}

function saveMods(){

        modsForm= document.forms['modsForm'];

        var d4Input= modsForm.elements['d4Mod']; var d6Input= modsForm.elements['d6Mod'];
        var d8Input= modsForm.elements['d8Mod']; var d10Input= modsForm.elements['d10Mod'];
        var d12Input= modsForm.elements['d12Mod']; var d20Input= modsForm.elements['d20Mod'];
        d4Mod=d4Input.value; d6Mod=d6Input.value; d8Mod=d8Input.value; d10Mod=d10Input.value;
        d12Mod=d12Input.value;
        d20Mod=d20Input.value;

        var Name= document.getElementById("handName").innerHTML;
        if( Players.find(x => x.name === Name)){
            var _player = Players.find(x => x.name === Name);
             _player.d4Mod=d4Mod;
             _player.d6Mod=d6Mod; _player.d8Mod=d8Mod; _player.d10Mod=d10Mod; _player.d12Mod=d12Mod;
             _player.d20Mod=d20Mod;

             saveHistory();
         }

        var modsForm= document.forms['modsForm'];;
        modsForm.style.display="none";
        modsButton=document.getElementById('modsButton');
        modsButton.style.display="none";
}

function modsToggle(){
        modsForm= document.forms['modsForm'];
        modsWrapper= document.getElementById("modsWrapper");
        if( modsForm.style.display != "none"){
            modsWrapper.style.display="none";
            modsForm.style.display="none";
            modsButton.style.display="none";
            saveMods();
        }
        else{
               // var modsWrapper= document.getElementById("modsWrapper");
                modsWrapper.style.display="table";
                modsForm.style.display="table";
                modsButton.style.display="table";

                d4Form.value=parseInt(d4Mod); d6Form.value=parseInt(d6Mod); d8Form.value= parseInt(d8Mod);
                d10Form.value=parseInt(d10Mod); d12Form.value=parseInt(d12Mod); d20Form.value=parseInt(d20Mod);
                document.getElementById("diceBoxLabel").scrollIntoView(false);

        }

}
//the load players Box
function loadPlayers(){
    var playerList = document.getElementById("playersContainer");
    if(playerList.style.display!="block"){
        playerList.style.display='block';
    }
    else{
        closeP();
    }
}
function closeP(){
    var playerList = document.getElementById("playersContainer");
    playerList.style.display='none';
}

function fillHand(playerName){

    var _player = Players.find(x => x.name === playerName);
    Name = playerName; lastName=playerName;
    document.getElementById("handName").innerHTML = Name;
    d4=_player.d4; d6 = _player.d6; d8=_player.d8;
    d10=_player.d10;d12=_player.d12; d20=_player.d20;
    d4Mod=_player.d4Mod; d6Mod=_player.d6Mod; d8Mod=_player.d8Mod;
    d10Mod=_player.d10Mod; d12Mod=_player.d12Mod; d20Mod=_player.d20Mod;
    document.getElementById("roll").style.display="inline-block";
       diceNum=0; diceType=0;
     if(d4 !=null ){document.getElementById("first").innerHTML= d4+"d4 "; diceType+=1; diceNum+=d4; }
        else{document.getElementById("first").innerHTML= ""; }
     if(d6 !=null ){document.getElementById("second").innerHTML= d6  +"d6 "; diceType+=1; diceNum+=d6; }
        else{ document.getElementById("second").innerHTML= "" ; }
     if(d8 !=null ){document.getElementById("third").innerHTML= d8+"d8 "; diceType+=1; diceNum+=d8; }
        else{ document.getElementById("third").innerHTML= "";}
     if(d10 !=null ){document.getElementById("fourth").innerHTML= d10+"d10 "; diceType+=1; diceNum+=d10; }
        else{document.getElementById("fourth").innerHTML= ""; }
     if(d12 !=null ){document.getElementById("fifth").innerHTML= d12+"d12 "; diceType+=1; diceNum+=d12; }
        else{document.getElementById("fifth").innerHTML=""; }
     if(d20 !=null ){document.getElementById("sixth").innerHTML= d20+"d20 "; diceType+=1; diceNum+=d20; }
        else{document.getElementById("sixth").innerHTML= ""; }
    if(diceNum >0){document.getElementById("zeroth").innerHTML= "";}

}

 function clearHand(){
        d4=null;d6=null;d8=null;d10=null;d12=null;d20=null;
        d4Mod=0;d6Mod=0;d8Mod=0;d10Mod=0;d12Mod=0; d20Mod=0;
        diceNum=0; diceType=0;
        Name = "Hand"; lastName ="Hand";
        document.getElementById("zeroth").innerHTML= "Empty";
        document.getElementById("handName").innerHTML= "Hand";
        document.getElementById("first").innerHTML = "";
        document.getElementById("second").innerHTML = "";
        document.getElementById("third").innerHTML = "";
        document.getElementById("fourth").innerHTML = "";
        document.getElementById("fifth").innerHTML = "";
        document.getElementById("sixth").innerHTML = "";
 }

 //the new hand button is slightly diff
 function newHand(){
    document.getElementById("bottom").scrollIntoView(false);
    clearHand();
    boxToggler=1;

 }

var boxToggler=0;
 function boxToggle(){
 if(!elementInViewport(document.getElementById("bottom")) || boxToggler == 0){
    document.getElementById("bottom").scrollIntoView(false);
    boxToggler=1;
 }
 else{
    var _rollHistory = document.getElementsByClassName("rollHistory");
    if(_rollHistory.length >= 1){
    document.getElementById("diceBoxLabel").scrollIntoView(false);

    }
    else{
        document.getElementsByTagName("h1")[0].scrollIntoView(true);
    }
    boxToggler=0;
 }

 }

function roll(){
    var field= document.getElementById("rolling");
    var playerName=document.getElementById("handName").innerHTML;

    if( !Players.find(x => x.name === playerName) && playerName != "Hand"){
        saveHand(playerName);
    }

    hrNode = document.createElement("P");
    //textNode.className="rollHistory";
    hrNode.innerHTML="<hr class=\"rollHistory\">";
     hrNode.id = rollsCount;//new line
    field.appendChild(hrNode);


    if(diceNum >=1){
        //sfx
        if(audio){
            var dMax =5; // Math.min(diceNum, 4);
            var dMin = 0;
            var audioRandom = Math.floor(Math.random() * (dMax - dMin ));
            switch(diceNum){
                case 1:
                    diceAudio[Math.floor(Math.random() *3)].play();
                    break;
                case 2:
                    diceAudio[audioRandom].play();
                    var audioRandom2 = Math.floor(Math.random() *5);
                    while(audioRandom2 == audioRandom ){
                        audioRandom2 = Math.floor(Math.random() *5);
                    }
                    diceAudio[audioRandom2].play();
                    break;

                case 3:
                   diceAudio[audioRandom].play();
                     for(x=0; x<= 2; x++){
                         if(x != audioRandom)
                        diceAudio[x].play();
                     }
                     break;
                case 4:
                   diceAudio[audioRandom].play();
                     for(x=0; x<= 3; x++){
                         if(x != audioRandom)
                        diceAudio[x].play();
                     }

                     break;

                default:
                  //  if(audioRandom == 5){
                   // audioRandom = 4;
                   // }
                     diceAudio[audioRandom].play();

                    console.log("diceAudio"+audioRandom+" Played");

                    for(x=0; x <= 4; x++){
                        if(x != audioRandom)
                            diceAudio[x].play();
                    }

                    break;
            }
        }

        var total = 0;
        var rollsN =0;  // to show a total or not?

        if (playerName != "Hand"){
            var textNode = document.createElement("NAME");
            textNode.className="rolledName";
            textNode.innerHTML="<p><b>" +playerName+" rolls:</b></p>";
            field.appendChild(textNode);
        }

        if(d4 >= 1){
            var min = d4;
            var max = d4*4;
            var random = Math.floor(Math.random() * (max - min + 1)) + min;
            total+=random;
            var textNode = document.createElement("P");
            if(d4Mod !=0){
            modded = random+parseInt(d4Mod);
            textNode.innerHTML=d4+"d4: <b>" +random+"</b>  +"+d4Mod+" = <b>" +modded+"</b>";
            total+=parseInt(d4Mod);
            }
            else{
            textNode.innerHTML=d4+"d4: <b>" +random+"</b>";
            }

            field.appendChild(textNode);

        }
        if(d6 >= 1){
            var min = d6;
            var max = d6*6;
            var random = Math.floor(Math.random() * (max - min + 1)) + min;
            total+=random;
            var textNode = document.createElement("P");
            if(d6Mod !=0){
                var modded = random+parseInt(d6Mod);
                textNode.innerHTML=d6+"d6:<b> " +random+"</b>  +"+d6Mod+" = <b>" +modded+"</b>";
                total+=parseInt(d6Mod);
            }
            else{
                textNode.innerHTML=d6+"d6: <b>" +random+"</b>";
            }

            field.appendChild(textNode);
        }
        if(d8 >= 1){
            var min = d8;
            var max = d8*8;
            var random = Math.floor(Math.random() * (max - min + 1)) + min;
            total+=random;
            var textNode = document.createElement("P");
            if(d8Mod !=0){
                var modded = random+parseInt(d8Mod);
                textNode.innerHTML=d8+"d8: <b>" +random+"</b>  +"+d8Mod+" = <b>" +modded+"</b>";
                total+=parseInt(d8Mod);
            }
            else{
                textNode.innerHTML=d8+"d8: <b>" +random+"</b>";
            }

            field.appendChild(textNode);
        }

        if(d10 >= 1){
            var min = d10;
            var max = d10*10;
            var random = Math.floor(Math.random() * (max - min + 1)) + min;
            total+=random;
            var textNode = document.createElement("P");
            if(d10Mod !=0){
                var modded = random+parseInt(d10Mod);
                textNode.innerHTML=d10+"d10: <b>" +random+"</b>  +"+d10Mod+" = <b>" +modded+"</b>";
                total+=parseInt(d10Mod);
            }
            else{
                 textNode.innerHTML=d10+"d10: <b>" +random+"</b>";
            }

            field.appendChild(textNode);
        }

        if(d12 >= 1){
            var min = d12;
            var max = d12*12;
            var random = Math.floor(Math.random() * (max - min + 1)) + min;
            total+=random;
            var textNode = document.createElement("P");
            if(d12Mod !=0){
                var modded = random+parseInt(d12Mod);
                textNode.innerHTML=d12+"d12: <b>" +random+"</b>  +"+d12Mod+" = <b>" +modded+"</b>";
                total+=parseInt(d12Mod);
            }
            else{
                 textNode.innerHTML=d12+"d12: <b>" +random+"</b>";
            }
            field.appendChild(textNode);
        }

        if(d20 >= 1){
            var min = d20;
            var max = d20*20;
            var random = Math.floor(Math.random() * (max - min + 1)) + min;
            total+= random;
            var textNode = document.createElement("P");
            if(d20Mod !=0){
                var modded = random+parseInt(d20Mod);
                textNode.innerHTML=d20+"d20: <b>" +random+"</b>  +"+d20Mod+" = <b>" +modded+"</b>";
                total+=parseInt(d20Mod);
            }
            else{
                 textNode.innerHTML=d20+"d20: <b>" +random+"</b>";
            }
            field.appendChild(textNode);
        }
        if (diceType >1){
            var totalsNode = document.createElement("TOTAL");
             totalsNode.innerHTML="<p><b>Total= "+total+"</b></p>";
             field.appendChild(totalsNode);
        }
        else if( total <1){
                        var textNode = document.createElement("P");
                        textNode.className="message"
                        textNode.innerHTML="<b>You rolled a 0 for ∞️ ! </b>";
                        field.appendChild(textNode);
        }

    }

    else if ( diceNum < 1 || diceNum == null){
        var textNode = document.createElement("P");
        textNode.className="message"
        textNode.innerHTML="<b>You rolled a 0 for ∞️ ! </b>";
        field.appendChild(textNode);
    }

    var _toggler=document.getElementById('diceBoxLabel');
    _toggler.scrollIntoView(false);
    boxToggler=0;

}

function d4Plus(){
    roller2= document.getElementById("roll");
    if(d4==null){diceNum+=1; diceType+=1;}else{ diceNum+=1; }
    d4+=1;
    roller2.style.display="table-cell";
    document.getElementById("zeroth").innerHTML = "";
    document.getElementById("first").innerHTML = d4+"d4 "
    var _Name = document.getElementById("handName").innerHTML;
    if( Players.find(x => x.name === _Name)){
        _player=Players.find(x => x.name === _Name);
        _player.d4=d4;
        saveHistory();
    }

}

function d4Minus(){
    var roller2= document.getElementById("roll");
    var Name = document.getElementById("handName").innerHTML;
    if(d4>0){
        d4-=1; diceNum-=1;
        document.getElementById("first").innerHTML = d4+"d4 ";
        if( Players.find(x => x.name === Name)){
            _player=Players.find(x => x.name === Name);
            _player.d4=d4;

            saveHistory();
        }
        if(d4 == 0 ){

            document.getElementById("first").innerHTML = "";
            d4= null; diceType-=1;
            if( Players.find(x => x.name === Name)){
                _player=Players.find(x => x.name === Name);
                _player.d4=null;
            }
            if(diceNum <=0){diceNum=null;}
            if(diceType<=0){diceType=null; roller.style.display="none"; }

        }

    }

}

function d6Plus(){
    var Name = document.getElementById("handName").innerHTML;
    if(d6==null){diceNum+=1; diceType+=1;}else{ diceNum+=1; }
    d6+=1;
    document.getElementById("roll").style.display="inline-block";
    document.getElementById("zeroth").innerHTML = "";
    document.getElementById("second").innerHTML = d6+"d6 ";

    if( Players.find(x => x.name === Name)){
        _player=Players.find(x => x.name === Name);
        _player.d6=d6;

        saveHistory();
    }

}

function d6Minus(){
    var Name = document.getElementById("handName").innerHTML;

    if(d6>0){
        d6-=1; diceNum-=1;
        document.getElementById("second").innerHTML = d6+"d6 ";

    }
    if(d6==0){
        document.getElementById("second").innerHTML = "";
        d6=null; diceType-=1;
    }

   if( Players.find(x => x.name === Name)){
        _player=Players.find(x => x.name === Name);
        _player.d6=d6;

        saveHistory();
    }
    if(diceNum <=0){diceNum=null;}
    if(diceType<=0){diceType=null; document.getElementById("roll").style.display="none"; }
}

function d8Plus(){
    var Name = document.getElementById("handName").innerHTML;
    if(d8==null){diceNum+=1; diceType+=1;}else{ diceNum+=1; }
    d8+=1;
    document.getElementById("roll").style.display="inline-block";
    document.getElementById("zeroth").innerHTML = "";
    document.getElementById("third").innerHTML = d8+"d8 ";

   if( Players.find(x => x.name === Name)){
        _player=Players.find(x => x.name === Name);
        _player.d8=d8;

        saveHistory();
    }
}

function d8Minus(){
    var Name = document.getElementById("handName").innerHTML;

    if(d8>0){
        d8-=1; diceNum-=1;
        document.getElementById("third").innerHTML = d8+"d8 ";
    }
    if(d8==0){
        document.getElementById("third").innerHTML = "";
        d8 = null; diceType-=1;
    }
   if( Players.find(x => x.name === Name)){
        _player=Players.find(x => x.name === Name);
        _player.d8=d8;

        saveHistory();
    }
    if(diceNum <=0){diceNum=null;}
    if(diceType<=0){diceType=null; document.getElementById("roll").style.display="none"; }
}
function d10Plus(){
    var Name = document.getElementById("handName").innerHTML;
    if(d10==null){diceNum+=1; diceType+=1;}else{ diceNum+=1; }
    d10+=1;
    document.getElementById("roll").style.display="inline-block";
    document.getElementById("zeroth").innerHTML = "";
    document.getElementById("fourth").innerHTML = d10+"d10 ";
    if( Players.find(x => x.name === Name)){
        _player=Players.find(x => x.name === Name);
        _player.d10=d10;

        savedNotif();
    }

}

function d10Minus(){
    var Name = document.getElementById("handName").innerHTML;

    if(d10>0){
        d10-=1; diceNum-=1;
        document.getElementById("fourth").innerHTML = d10+"d10 ";
    }
    if(d10==0){
        document.getElementById("fourth").innerHTML = "";
        d10 = null; diceType-=1;
    }
    if( Players.find(x => x.name === Name)){
        _player=Players.find(x => x.name === Name);
        _player.d10=d10;

        savedNotif();
    }
    if(diceNum <=0){diceNum=null;}
    if(diceType<=0){diceType=null; document.getElementById("roll").style.display="none"; }

}
function d12Plus(){
    var Name = document.getElementById("handName").innerHTML;
    if(d12==null){diceNum+=1; diceType+=1;}else{ diceNum+=1; }
    d12+=1;
    document.getElementById("roll").style.display="inline-block";
    document.getElementById("zeroth").innerHTML = "";
    document.getElementById("fifth").innerHTML = d12+"d12 ";
    if( Players.find(x => x.name === Name)){
        _player=Players.find(x => x.name === Name);
        _player.d12=d12;

        saveHistory();
    }
}

function d12Minus(){
    var Name = document.getElementById("handName").innerHTML;

    if(d12>0){
        d12-=1; diceNum-=1;
        document.getElementById("fifth").innerHTML = d12+"d12 ";
    }
    if(d12==0){
        document.getElementById("fifth").innerHTML = "";
        d12= null; diceType-=1;
    }

    if( Players.find(x => x.name === Name)){
        _player=Players.find(x => x.name === Name);
        _player.d12=d12;

        saveHistory();
    }
    if(diceNum <=0){diceNum=null;}
    if(diceType<=0){diceType=null; document.getElementById("roll").style.display="none"; }
}

function d20Plus(){
    var Name = document.getElementById("handName").innerHTML;
    if(d20==null){diceNum+=1; diceType+=1;}else{ diceNum+=1; }
    d20+=1;
    document.getElementById("roll").style.display="inline-block";
    document.getElementById("zeroth").innerHTML = "";
    document.getElementById("sixth").innerHTML = d20+"d20 ";
        if( Players.find(x => x.name === Name)){
            _player=Players.find(x => x.name === Name);
            _player.d20=d20;

             saveHistory();
        }
}

function d20Minus(){
    var Name = document.getElementById("handName").innerHTML;

    if(d20>0){
        d20-=1; diceNum-=1;
        document.getElementById("sixth").innerHTML = d20+"d20 ";
    }
    if(d20==0){
        document.getElementById("sixth").innerHTML = "";
        d20 = null; diceType-=1;
    }

    if( Players.find(x => x.name === Name)){
        _player=Players.find(x => x.name === Name);
        _player.d20=d20;
        saveHistory();
    }
    if(diceNum ==0){diceNum=null;}
    if(diceType==0){diceType=null; document.getElementById("roll").style.display="none"; }

}

function boxScaler(){
    if(!widened){
    wrapper = document.getElementById('boxOuterWrapper');
    boxMenu = document.getElementById('diceMenu');
    wrapper.style.width ="98%";
    wrapper.style.maxWidth="98%";
    wrapper.style.margin="none";
    boxMenu.style.width ="98%";
    boxMenu.style.margin= "none";
    boxMenu.style.maxWidth="98%"
    widened=true;
    }
    else{
        wrapper = document.getElementById('boxOuterWrapper');
        boxMenu = document.getElementById('diceMenu');
        wrapper.style.width ="98%";
        wrapper.style.maxWidth="520px";
        wrapper.style.margin="auto";
        boxMenu.style.width ="98%";
        boxMenu.style.margin= "auto";
        boxMenu.style.maxWidth="400px"
        widened=false;
    }


}

function elementInViewport(el) {
   var top = el.offsetTop;
   var left = el.offsetLeft;
   var width = el.offsetWidth;
   var height = el.offsetHeight;

   while(el.offsetParent) {
     el = el.offsetParent;
     top += el.offsetTop;
     left += el.offsetLeft;
   }

   return (
     top < (window.pageYOffset + window.innerHeight) &&
     left < (window.pageXOffset + window.innerWidth) &&
     (top + height) > window.pageYOffset &&
     (left + width) > window.pageXOffset
   );
 }

window.onload=function(){
    dice1Audio = new Audio("sounds/dice.mp3");
    dice2Audio = new Audio("sounds/dice2.mp3");
    dice3Audio = new Audio("sounds/dice3.mp3");
    dice4Audio = new Audio("sounds/dice4.mp3");
    dice5Audio = new Audio("sounds/dice5.mp3");
    diceAudio.push(dice1Audio,dice3Audio,dice4Audio,dice5Audio,dice2Audio);
    modsWrapper =document.getElementById["modsWrapper"];
    modsForm= document.forms["modsForm"];
    modsButton=document.getElementById("modsButton");
    d4Form= modsForm.elements["d4Mod"]; d6Form= modsForm.elements["d6Mod"]; d8Form= modsForm.elements["d8Mod"];
    d10Form= modsForm.elements["d10Mod"]; d12Form= modsForm.elements["d12Mod"]; d20Form= modsForm.elements["d20Mod"];
    modsForm=document.forms['modsForm'].style.display="none";
    modsButton= document.getElementById('modsButton');
    modsButton.style.display="none";
    console.log("cookies" + Cookies.get("players"));
    if(Cookies.get('players')){
        Players= Cookies.getJSON('players');

        for(i =0; i<Players.length; i++){
            Players[i].name = Players[i].name.replace(/<br\s*[\/]?>/gi, "");
            var playerName =Players[i].name;
            //playerName = playerName.replace(/<br\s*[\/]?>/gi, "");
            console.log(playerName);
            addPlayer(playerName);
        }

    }
    if(Cookies.get("lastName")){
        var lastRoller = Cookies.get("lastName");
        lastRoller = lastRoller.replace(/<br\s*[\/]?>/gi, "");
        console.log(lastRoller);
        fillHand(lastRoller);
    }

}

 function saveHistory(){
        Cookies.set("players", Players , { expires: 7000 });
        Cookies.set("lastName",lastName, {expires:100});
        savedNotif();
    }


function savedNotif(){
        var notif= document.getElementById("saved");
        var textNode = document.createElement("SAVED");
        textNode.innerHTML="<p>Saved</p>";
        notif.appendChild(textNode);


        setTimeout(removeNotif, 3000);
}

function removeNotif(){
    var field= document.getElementById("saved");
    while (field.firstChild ) {
        field.removeChild(field.firstChild);

      }
    }
