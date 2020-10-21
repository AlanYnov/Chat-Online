
$('.btn').click(function(){ //au click du bouton de connexion
	if($('#username').val()!==''){
		$('#mainCtn').css('display', 'none');
		$('#global').css('display', 'flex');
		$('#m').focus(); //focus sur le champ du message
		let click = true;
		socket.emit('general', click); //les 20 derniers msg se chargent à sa connexion
	}
});

let userList = [];
const socket = io();
let privateUser = ''; //si un message privé est à envoyer

$('#formEnvoyer').submit(function(){ //au submit du message
	let variable = $('#m').val().trim(); //enlève les espaces dans le message
	if((variable != '') && ($('#general').hasClass('selected'))){ //teste si le message est vide et que l'on veut envoyer le message au général
		socket.emit('chat message', $('#m').val());
	}
	else if(variable != ''){
		socket.emit('private message', $('#m').val(), privateUser);
	}
	$('#m').val('');
	return false;
});

function privateMsg(id){ //lorsqu'on click sur le nom d'un user avec qui on veut avoir une conv privée 
	if(!$('#'+id).find('img').hasClass('none')){ //on enlève la notif si elle existe
		$('#'+id).find('img').addClass('none');
	}
	//on supprime les class
	$('#general').removeClass('selected');
	$('#general').addClass('autres');
	//console.log(id); //on récupère l'id du user
	$('.selected').addClass('autres');
	$('.selected').removeClass('selected');
	$('#'+id).removeClass('autres');
	$('#'+id).addClass('selected');
	$('#messages').empty(); //on vide les messages à chaque changement de conv
	privateUser = id;
	let click = true;
	socket.emit('enter private message', click);
};

socket.on('new user', userList => { //à chaque nouvel utilisateur on reconstruit la liste des users
	let dernierUser = userList[userList.length - 1].user;
	$('#messages').append('<div>'+ dernierUser + ' est entré(e) dans le salon''</div>');
	$('#membres').empty(); //on la vide
	$('#membres').append('<div id="general" class="selected" onclick="generalClick(this.id);">Général<img src="../img/notification.png" class="notif none" alt="notif"></div>');
	
	for(let i = 0 ; i < userList.length; i++){ //boucle pour afficher les users connectés
		$('#membres').append('<div class="autres" id="'+userList[i].id+'" onclick="privateMsg(this.id);">'+userList[i].user+'<img src="../img/notification.png" class="notif none" alt="notif"></div>');
	}
	$('#membres').append('<div id="fermer" class="deco" onclick="decoClick();">Déconnexion</div>');
});

function login(e){ //login du user, on envoit son nom au serveur
	$('#user').text(e);
	//console.log('hello ' + e);
	socket.emit('user', e);
};

function decoClick(){ //pour déconnecter le user en question
	let userName = $('#user').text();
	socket.emit('deconnexion', userName); //on envoit le user qui se déconnecte au serveur
	$('#mainCtn').css('display', 'flex');
	$('#global').css('display', 'none');
	$('#username').val('');
};

socket.on('deconnexion', userList => { //pour afficher la nouvelle liste après la déconnexion
	$('#membres').empty(); //on la vide
	$('#membres').append('<div id="general" class="selected" onclick="generalClick(this.id);">Général</div>');
	
	for(let i = 0 ; i < userList.length; i++){ //boucle pour afficher les users connectés
		$('#membres').append('<div class="autres" id="'+userList[i].id+'" onclick="privateMsg(this.id);">'+userList[i].user+'</div>');
	}
	$('#membres').append('<div id="fermer" class="deco" onclick="decoClick();">Déconnexion</div>');
});

socket.on('chat message', function(msg){ //lorsqu'on reçoit le message et qu'on souhaite l'afficher
	if(!$('#general').hasClass('selected')){ //ajoute la notif
		$('#general').find('img').removeClass('none');
	}
	if($('#general').hasClass('selected')){ //si on est placé dans le canal général
		//construction de la date
		let date = new Date();
		let heure = date.getHours(); //récupérer heure
		let minutes = date.getMinutes(); //récupérer minutes
		let jour = date.getDate();
		let mois = date.getMonth() + 1;
		let convertMinutes = minutes.toString();
		let	convertJour = jour.toString();
		let	convertMois = mois.toString();
		let devant = "";
		let devant1 = "";
		let devant2 = "";
		if(convertMinutes.length == 1){ //mettre un zéro devant
			devant = "0";
		}
		if(convertJour.length == 1){ //mettre un zéro devant
			devant1 = "0";
		}
		if(convertMois.length == 1){ //mettre un zéro devant
			devant2 = "0";
		}
		
		let class1 = '';
		let class2 = '';
		let class3 = '';
		let messageForm = '';
		
		//définir les classes en fonction du user qui les envoit
		if(msg.id == socket.id){ //si le socket et l'expediteur ont le même id
			class1 = 'messageDetailRight';
			class2 = 'messageRight';
			class3 = 'userRight';
			messageForm = "<div class='containMessage'><span class='user "+ class3 +"'>"+ msg.expediteur +"</span><span class="+ class2 +"><span class='heure'>Le " + devant1 + jour + "/" + devant2 + mois  + " à "+ heure + ":" + devant + minutes +"</span><span class='messageDetail "+ class1 +"'>"+ msg.message +"</span></span></div>";
		}
		else{ //sinon
			class1 = 'messageDetailLeft';
			class2 = 'messageLeft';
			class3 = 'userLeft';
			messageForm = "<div class='containMessage'><span class='user "+ class3 +"'>"+ msg.expediteur +"</span><span class="+ class2 +"><span class='messageDetail "+ class1 +"'>"+ msg.message +"</span><span class='heure'>Le " + devant1 + jour + "/" + devant2 + mois  + " à "+ heure + ":" + devant + minutes +"</span></span></div>";
		}
		$('#messages').append(messageForm);
		window.scrollTo(0, document.body.scrollHeight);
	}
});

function generalClick(id){ //quand on click sur le canal général
	$('.selected').addClass('autres');
	$('.selected').removeClass('selected');
	$('#'+id).removeClass('autres');
	$('#'+id).addClass('selected');
	let click = true;
	socket.emit('general', click);
};

socket.on('general', function(tableau){ //les 20 derniers msg se chargent quand il revient sur le chat général
	if($('#general').hasClass('selected')){ //supprime notif
		$('#general').find('img').addClass('none');
	}
	//construction de la date
	if($('#general').hasClass('selected')){ //si on est placé dans le canal général
		let date = new Date();
		let heure = date.getHours(); //récupérer heure
		let minutes = date.getMinutes(); //récupérer minutes
		let jour = date.getDate();
		let mois = date.getMonth() + 1;
		let convertMinutes = minutes.toString();
		let	convertJour = jour.toString();
		let	convertMois = mois.toString();
		let devant = "";
		let devant1 = "";
		let devant2 = "";
		if(convertMinutes.length == 1){ //mettre un zéro devant
			devant = "0";
		}
		if(convertJour.length == 1){ //mettre un zéro devant
			devant1 = "0";
		}
		if(convertMois.length == 1){ //mettre un zéro devant
			devant2 = "0";
		}

		let class1 = '';
		let class2 = '';
		let class3 = '';
		let messageForm = '';
		$('#messages').empty();
		
		//définir les classes en fonction du user qui les envoit
		for(let i = 0; i < tableau.length; i++){
			if(tableau[i].id == socket.id){ //si le socket et l'expediteur ont le même id
				class1 = 'messageDetailRight';
				class2 = 'messageRight';
				class3 = 'userRight';
				messageForm = "<div class='containMessage'><span class='user "+ class3 +"'>"+ tableau[i].expediteur +"</span><span class="+ class2 +"><span class='heure'>Le " + devant1 + jour + "/" + devant2 + mois  + " à "+ heure + ":" + devant + minutes +"</span><span class='messageDetail "+ class1 +"'>"+ tableau[i].message +"</span></span></div>";
			}
			else{ //sinon
				class1 = 'messageDetailLeft';
				class2 = 'messageLeft';
				class3 = 'userLeft';
				messageForm = "<div class='containMessage'><span class='user "+ class3 +"'>"+ tableau[i].expediteur +"</span><span class="+ class2 +"><span class='messageDetail "+ class1 +"'>"+ tableau[i].message +"</span><span class='heure'>Le " + devant1 + jour + "/" + devant2 + mois  + " à "+ heure + ":" + devant + minutes +"</span></span></div>";
			}
			$('#messages').append(messageForm);
		}
		window.scrollTo(0, document.body.scrollHeight);
	}
});

let typing = false;

$(document).ready(function(){ //fonction pour écouter si le user tape un message
	$('#m').keypress((e) => { //si le user est en train d'écrire dans la barre du message
		if(e.which!=13){
			typing = true;
		}
	});
});

function boucle(){ //renvoit si oui ou non une touche a été pressée
	socket.emit('typing', typing);
	if(typing == true){
		//console.log('tapée');
		typing = false;
	}
	setTimeout("boucle();", 2000); //à réduire si on veut plus de responsivité
};
boucle();

socket.on('display', (barre) => { //on change le texte si le user tape ou non
	if(barre[0].typing == true){
		if(barre[0].id != socket.id){ //si le socket à le même id que le user qui tape on ne remplit pas typing
			$('#taper').text(`${barre[0].user} is typing...`); //on affiche le user qui écrit
			$('#taper').addClass(barre[0].id);
		}
	}
	else{
		if(barre[0].id == socket.id){ //si le socket à le même id que le user qui tape on ne remplit pas typing
			$('#taper').text(''); //on affiche que le user ne tape plus
		}
	}
});

socket.on('private message', function(tableau){ //afficher les messages privés des conv
	let dernierMsg = tableau[tableau.length - 1].id; //le dernier user qui a envoyé un message privé
	let destinataire = tableau[tableau.length - 1].destinataire;
	if(!$('#'+dernierMsg).hasClass('selected') && dernierMsg != socket.id && destinataire == socket.id){ //si on reçoit un message afficher une notif
		$('#'+dernierMsg).find('img').removeClass('none');
	}
	
	if(!$('#general').hasClass('selected')){ //si on n'est pas dans le chat général
		$('#messages').empty();
		//console.log('pas dans le général');
		let date = new Date();
		let heure = date.getHours(); //récupérer heure
		let minutes = date.getMinutes(); //récupérer minutes
		let jour = date.getDate();
		let mois = date.getMonth() + 1;
		let convertMinutes = minutes.toString();
		let	convertJour = jour.toString();
		let	convertMois = mois.toString();
		let devant = "";
		let devant1 = "";
		let devant2 = "";
		if(convertMinutes.length == 1){ //mettre un zéro devant
			devant = "0";
		}
		if(convertJour.length == 1){ //mettre un zéro devant
			devant1 = "0";
		}
		if(convertMois.length == 1){ //mettre un zéro devant
			devant2 = "0";
		}

		let class1 = '';
		let class2 = '';
		let class3 = '';
		let messageForm = '';
		
		for(let i = 0; i < tableau.length; i++){
			if((tableau[i].id == privateUser && tableau[i].destinataire == socket.id) || (tableau[i].id == socket.id && tableau[i].destinataire == privateUser)){ //si on est sur une conv privée en affiche les msg
				if(tableau[i].id == socket.id){ //si le socket et l'expediteur ont le même id
					class1 = 'messageDetailRight';
					class2 = 'messageRight';
					class3 = 'userRight';
					messageForm = "<div class='containMessage'><span class='user "+ class3 +"'>"+ tableau[i].expediteur +"</span><span class="+ class2 +"><span class='heure'>Le " + devant1 + jour + "/" + devant2 + mois  + " à "+ heure + ":" + devant + minutes +"</span><span class='messageDetail "+ class1 +"'>"+ tableau[i].message +"</span></span></div>";
				}
				else{ //sinon
					class1 = 'messageDetailLeft';
					class2 = 'messageLeft';
					class3 = 'userLeft';
					messageForm = "<div class='containMessage'><span class='user "+ class3 +"'>"+ tableau[i].expediteur +"</span><span class="+ class2 +"><span class='messageDetail "+ class1 +"'>"+ tableau[i].message +"</span><span class='heure'>Le " + devant1 + jour + "/" + devant2 + mois  + " à "+ heure + ":" + devant + minutes +"</span></span></div>";
				}
				$('#messages').append(messageForm);
			}
		}
		window.scrollTo(0, document.body.scrollHeight);
	}
});

socket.on('enter private message', function(tableau){ //afficher les messages privés des conv
	if(!$('#general').hasClass('selected')){ //si on n'est pas dans le chat général
		let date = new Date();
		let heure = date.getHours(); //récupérer heure
		let minutes = date.getMinutes(); //récupérer minutes
		let jour = date.getDate();
		let mois = date.getMonth() + 1;
		let convertMinutes = minutes.toString();
		let	convertJour = jour.toString();
		let	convertMois = mois.toString();
		let devant = "";
		let devant1 = "";
		let devant2 = "";
		if(convertMinutes.length == 1){ //mettre un zéro devant
			devant = "0";
		}
		if(convertJour.length == 1){ //mettre un zéro devant
			devant1 = "0";
		}
		if(convertMois.length == 1){ //mettre un zéro devant
			devant2 = "0";
		}

		let class1 = '';
		let class2 = '';
		let class3 = '';
		let messageForm = '';
		$('#messages').empty();
		
		for(let i = 0; i < tableau.length; i++){
			if((tableau[i].id == privateUser && tableau[i].destinataire == socket.id) || (tableau[i].id == socket.id && tableau[i].destinataire == privateUser)){ //si on est sur une conv privée en affiche les msg
				if(tableau[i].id == socket.id){ //si le socket et l'expediteur ont le même id
					class1 = 'messageDetailRight';
					class2 = 'messageRight';
					class3 = 'userRight';
					messageForm = "<div class='containMessage'><span class='user "+ class3 +"'>"+ tableau[i].expediteur +"</span><span class="+ class2 +"><span class='heure'>Le " + devant1 + jour + "/" + devant2 + mois  + " à "+ heure + ":" + devant + minutes +"</span><span class='messageDetail "+ class1 +"'>"+ tableau[i].message +"</span></span></div>";
				}
				else{ //sinon
					class1 = 'messageDetailLeft';
					class2 = 'messageLeft';
					class3 = 'userLeft';
					messageForm = "<div class='containMessage'><span class='user "+ class3 +"'>"+ tableau[i].expediteur +"</span><span class="+ class2 +"><span class='messageDetail "+ class1 +"'>"+ tableau[i].message +"</span><span class='heure'>Le " + devant1 + jour + "/" + devant2 + mois  + " à "+ heure + ":" + devant + minutes +"</span></span></div>";
				}
				$('#messages').append(messageForm);
			}
		}
		window.scrollTo(0, document.body.scrollHeight);
	}
});



