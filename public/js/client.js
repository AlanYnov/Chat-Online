
let userList = [];
const socket = io();
let privateUser = ''; //si un message privé est à envoyer
let img = 'img/man.png';
let dateNow = function getDate(date){
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
				if(convertMinutes.length == 1){ devant = "0"; }
				if(convertJour.length == 1){ devant1 = "0"; }
				if(convertMois.length == 1){ devant2 = "0"; }
				let dateGlobale = "Le " + devant1 + convertJour + "/" + devant2 + convertMois + " à " + heure + ":" + devant + convertMinutes;
				return dateGlobale;
			}

$('.imageUser').children().click(function(){
	$('.imageUser').children().removeClass('imageSelected');
	$(this).addClass('imageSelected');
	img = $(this).attr('src');
	$('#imgUser').attr('src',img);
});

function login(e){ //login du user, on envoit son nom au serveur
	const userRegex = RegExp('^[a-zA-Z]+$', 'g');
	let user = $('#username').val().trim();
	let result = userRegex.test(user);
	if(result == true){
		$('#mainCtn').css('display', 'none');
		$('#global').css('display', 'flex');
		$('#user').text(e);
		$('#m').focus(); //focus sur le champ du message
		socket.emit('user', e, img);
	}
	else{
		$('#username').css('border', 'solid 1px red');
	}
};

$('.btn').click(function(){ //au click du bouton de connexion
	let click = true;
	socket.emit('general', click); //les 20 derniers msg se chargent à sa connexion
});

function generalClick(id){ //quand on click sur le canal général
	$('.selected').addClass('autres');
	$('.selected').removeClass('selected');
	$('#'+id).removeClass('autres');
	$('#'+id).addClass('selected');
	$('#convName').text('Général');
	let click = true;
	socket.emit('general', click);
};

$('#formEnvoyer').submit(function(){ //au submit du message
	let variable = $('#m').val().trim(); //enlève les espaces dans le message
	let date = dateNow(new Date); //recupère la date et heure d'envoi
	if((variable != '') && ($('#general').hasClass('selected'))){ //teste si le message est vide et que l'on veut envoyer le message au général
		socket.emit('chat message', $('#m').val(), date);
	}
	else if(variable != ''){
		socket.emit('private message', $('#m').val(), privateUser, date);
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
	$('.selected').addClass('autres');
	$('.selected').removeClass('selected');
	$('#'+id).removeClass('autres');
	$('#'+id).addClass('selected');
	$('#messages').empty(); //on vide les messages à chaque changement de conv
	privateUser = id;
	let name = $('#'+privateUser).text();
	$('#convName').text(name);
	let click = true;
	socket.emit('enter private message', click);
};

socket.on('list', userList => { //générer nouvelle liste users (connexion, déconnexion)
	$('#membres').empty(); //on la vide
	$('#membres').append('<div id="general" class="selected" onclick="generalClick(this.id);">Général<img src="../img/notification.png" class="notif none" alt="notif"></div>');
	
	for(let i = 0 ; i < userList.length; i++){ //boucle pour afficher les users connectés
		$('#membres').append('<div class="userFrame" id="'+userList[i].id+'" onclick="privateMsg(this.id);"><div class="profilCtn"><img src="'+ userList[i].img +'" id="imgUser" alt="image man">'+userList[i].user+'</div><img src="../img/notification.png" class="notif none" alt="notif"></div>');
	}
});

$('.material-icons').click(function(){ //action de déconnexion
	decoClick();
})

function decoClick(){ //pour déconnecter le user en question
	let userName = $('#user').text();
	socket.emit('deconnexion', userName); //on envoit le user qui se déconnecte au serveur
	$('#mainCtn').css('display', 'flex');
	$('#global').css('display', 'none');
};

$('#notification').click(function(){ //afficher/masquer les notifications
	let click = true;
	socket.emit('notifications', click);
    if($('.active')[0]){
        $('#notification').attr('src', 'img/bell.png');
        $('#notification').removeClass('active');
		
    } else{
        $('#notification').attr('src', 'img/bell1.png');
        $('#notification').addClass('active');
    }
});

socket.on('chat message', function(msg, tableau, user){ //lorsqu'on reçoit le message et qu'on souhaite l'afficher
	let notif = true;
	for(let i = 0; i < user.length; i++){
		if(user[i].id == socket.id){
			notif = user[i].notif;
		}
	}
	if(!$('#general').hasClass('selected') && notif == true){ //ajoute la notif
		$('#general').find('img').removeClass('none');
	}
	if($('#general').hasClass('selected')){ //si on est placé dans le canal général
		let class1 = '';
		let class2 = '';
		let class3 = '';
		let messageForm = '';
		
		//définir les classes en fonction du user qui les envoit
		if(msg.id == socket.id){ //si le socket et l'expediteur ont le même id
			class1 = 'messageDetailRight';
			class2 = 'messageRight';
			class3 = 'userRight';
			if(msg.id == tableau[tableau.length - 2].id){
				messageForm = "<br/>" + msg.message;
				$("#messages .containMessage:last-child span:last-child span:last-child").append(messageForm);
			}
			else{
				messageForm = "<div class='containMessage'><img src="+ msg.img +" class='imgUserSend right' alt='image user'/><span class='user "+ class3 +"'>"+ msg.expediteur +"</span><span class="+ class2 +"><span class='heure'>" + msg.date + "</span><span class='messageDetail "+ class1 +"'>"+ msg.message +"</span></span></div>";
				$('#messages').append(messageForm);
			}
		}
		else{ //sinon
			class1 = 'messageDetailLeft';
			class2 = 'messageLeft';
			class3 = 'userLeft';
			if(msg.id == tableau[tableau.length - 2].id){
				messageForm = "<br/>" + msg.message;
				$("#messages .containMessage:last-child span:last-child span:first-child").append(messageForm);
			}
			else{
				messageForm = "<div class='containMessage'><img src="+ msg.img +" class='imgUserSend left' alt='image user'/><span class='user "+ class3 +"'>"+ msg.expediteur +"</span><span class="+ class2 +"><span class='messageDetail "+ class1 +"'>"+ msg.message +"</span><span class='heure'>" + msg.date + "</span></span></div>";
				$('#messages').append(messageForm);
			}
		}
		
		window.scrollTo(0, document.body.scrollHeight);
	}
});

socket.on('general', function(tableau,tableau2){ //les 20 derniers msg se chargent quand il revient sur le chat général
	if($('#general').hasClass('selected')){ //supprime notif
		$('#general').find('img').addClass('none');
	}
	//construction de la date
	if($('#general').hasClass('selected')){ //si on est placé dans le canal général
		let class1 = '';
		let class2 = '';
		let class3 = '';
		let messageForm = '';
		
		let taille = tableau.length;
		let taille2 = tableau2.length;
		
		if((tableau[taille - 1].connected != socket.id && tableau2[taille2 - 1].id != socket.id)){ //si le user vient de se conneter ou aller dans le canal général ou les deux
			//console.log('pas moi');
		}
		else{	
			$('#messages').empty();
			
			//définir les classes en fonction du user qui les envoit
			for(let i = 0; i < tableau.length; i++){
				if(tableau[i].id == socket.id){ //si le socket et l'expediteur ont le même id
					class1 = 'messageDetailRight';
					class2 = 'messageRight';
					class3 = 'userRight';
					if(tableau[i - 1].id == tableau[i].id){
						messageForm = "<br/>" + tableau[i].message;
						$("#messages .containMessage:last-child span:last-child span:last-child").append(messageForm);
					}
					else{
						messageForm = "<div class='containMessage'><img src="+ tableau[i].img +" class='imgUserSend right' alt='image user'/><span class='user "+ class3 +"'>"+ tableau[i].expediteur +"</span><span class="+ class2 +"><span class='heure'>" + tableau[i].date + "</span><span class='messageDetail "+ class1 +"'>"+ tableau[i].message +"</span></span></div>";
						$('#messages').append(messageForm);
					}
				}
				else if(tableau[i].id == 'serveur'){ //si id = 'serveur'
					messageForm = '<div class="serverMessage">'+ tableau[i].expediteur + ' ' + tableau[i].message +'</div>';
					$('#messages').append(messageForm);
				}
				else{ //sinon
					class1 = 'messageDetailLeft';
					class2 = 'messageLeft';
					class3 = 'userLeft';
					if(tableau[i - 1].id == tableau[i].id){
						messageForm = "<br/>" + tableau[i].message;
						$("#messages .containMessage:last-child span:last-child span:first-child").append(messageForm);
					}
					else{
						messageForm = "<div class='containMessage'><img src="+ tableau[i].img +" class='imgUserSend left' alt='image user'/><span class='user "+ class3 +"'>"+ tableau[i].expediteur +"</span><span class="+ class2 +"><span class='messageDetail "+ class1 +"'>"+ tableau[i].message +"</span><span class='heure'>" + tableau[i].date + "</span></span></div>";
						$('#messages').append(messageForm);
					}
				}
			}
			window.scrollTo(0, document.body.scrollHeight);
		}
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

socket.on('private message', function(tableau, user){ //afficher les messages privés des conv
	let notif = true;
	for(let i = 0; i < user.length; i++){
		if(user[i].id == socket.id){
			notif = user[i].notif;
		}
	}
	let dernierMsg = tableau[tableau.length - 1].id; //le dernier user qui a envoyé un message privé
	let destinataire = tableau[tableau.length - 1].destinataire;
	if(!$('#'+dernierMsg).hasClass('selected') && dernierMsg != socket.id && destinataire == socket.id && notif == true){ //si on reçoit un message afficher une notif
		$('#'+dernierMsg).find('img').removeClass('none');
	}
	
	if(!$('#general').hasClass('selected')){ //si on n'est pas dans le chat général
		$('#messages').empty();
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
					if(tableau[i - 1].id == tableau[i].id){
						messageForm = "<br/>" + tableau[i].message;
						$("#messages .containMessage:last-child span:last-child span:last-child").append(messageForm);
					}
					else{
						messageForm = "<div class='containMessage'><img src="+ tableau[i].img +" class='imgUserSend right' alt='image user'/><span class='user "+ class3 +"'>"+ tableau[i].expediteur +"</span><span class="+ class2 +"><span class='heure'>" + tableau[i].date + "</span><span class='messageDetail "+ class1 +"'>"+ tableau[i].message +"</span></span></div>";
						$('#messages').append(messageForm);
					}
				}
				else{ //sinon
					class1 = 'messageDetailLeft';
					class2 = 'messageLeft';
					class3 = 'userLeft';
					if(tableau[i - 1].id == tableau[i].id){
						messageForm = "<br/>" + tableau[i].message;
						$("#messages .containMessage:last-child span:last-child span:first-child").append(messageForm);
					}
					else{
						messageForm = "<div class='containMessage'><img src="+ tableau[i].img +" class='imgUserSend left' alt='image user'/><span class='user "+ class3 +"'>"+ tableau[i].expediteur +"</span><span class="+ class2 +"><span class='messageDetail "+ class1 +"'>"+ tableau[i].message +"</span><span class='heure'>" + tableau[i].date + "</span></span></div>";
						$('#messages').append(messageForm);
					}				
				}
			}
		}
		window.scrollTo(0, document.body.scrollHeight);
	}
});

socket.on('enter private message', function(tableau){ //afficher les messages privés des conv
	if(!$('#general').hasClass('selected')){ //si on n'est pas dans le chat général
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
					if(tableau[i - 1].id == tableau[i].id){
						messageForm = "<br/>" + tableau[i].message;
						$("#messages .containMessage:last-child span:last-child span:last-child").append(messageForm);
					}
					else{
						messageForm = "<div class='containMessage'><img src="+ tableau[i].img +" class='imgUserSend right' alt='image user'/><span class='user "+ class3 +"'>"+ tableau[i].expediteur +"</span><span class="+ class2 +"><span class='heure'>" + tableau[i].date + "</span><span class='messageDetail "+ class1 +"'>"+ tableau[i].message +"</span></span></div>";
						$('#messages').append(messageForm);
					}
				}
				else{ //sinon
					class1 = 'messageDetailLeft';
					class2 = 'messageLeft';
					class3 = 'userLeft';
					if(tableau[i - 1].id == tableau[i].id){
						messageForm = "<br/>" + tableau[i].message;
						$("#messages .containMessage:last-child span:last-child span:first-child").append(messageForm);
					}
					else{
						messageForm = "<div class='containMessage'><img src="+ tableau[i].img +" class='imgUserSend left' alt='image user'/><span class='user "+ class3 +"'>"+ tableau[i].expediteur +"</span><span class="+ class2 +"><span class='messageDetail "+ class1 +"'>"+ tableau[i].message +"</span><span class='heure'>" + tableau[i].date + "</span></span></div>";
						$('#messages').append(messageForm);
					}				
				}
			}
		}
		window.scrollTo(0, document.body.scrollHeight);
	}
});

socket.on('co affiche', connexion => { //en cas de connexion
	$('#messages').append('<div class="serverMessage">'+ connexion.expediteur +' est entré(e) dans le salon</div>');
});

socket.on('deco affiche', deconnexion => { //en cas de déconnexion
	$('#messages').append('<div class="serverMessage">'+ deconnexion.expediteur +' a quitté le salon</div>');
});
