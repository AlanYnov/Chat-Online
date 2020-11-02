
let userList = [];
const socket = io();
let privateUser = ''; //si un message privé est à envoyer
let img = 'img/superkitty.png';
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
	$('.imgUser').attr('src',img);
});

function login(e){ //login du user, on envoit son nom au serveur
	const userRegex = RegExp('^[a-zA-Zéèêçîï0-9]+$', 'g');
	let user = $('#username').val().trim();
	let result = userRegex.test(user);
	if(result == true){
		$('#popupCtn').css('display', 'none');
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
	variable = variable.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/emit/g, "emit");
	let date = dateNow(new Date); //recupère la date et heure d'envoi
	if((variable != '') && ($('#general').hasClass('selected'))){ //teste si le message est vide et que l'on veut envoyer le message au général
		socket.emit('chat message', variable, date);
	}
	else if(variable != ''){
		socket.emit('private message', variable, privateUser, date);
	}
	$('#m').val('');
	return false;
});

function privateMsg(id){ //lorsqu'on click sur le nom d'un user avec qui on veut avoir une conv privée
	if(!$('#'+id).find('img').hasClass('none')){ //on enlève la notif si elle existe
		$('#'+id+' .notif').addClass('none');
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
	$('#membres').append('<div id="general" class="generalFrame selected" onclick="generalClick(this.id);"><div class="profilCtn"><img src="../img/g.png" class="imgGeneral" alt="salon general">Salon Général</div><img src="../img/notification.png" class="notif none" alt="notif"></div>');
	for(let i = 0 ; i < userList.length; i++){//boucle pour afficher les users connectés
		if(userList[i].notif == true){
			point='green.png';
		} else {
			point='red.png';
		}
		$('#membres').append('<div class="userFrame" id="'+userList[i].id+'" onclick="privateMsg(this.id);"><div class="profilCtn"><img src="'+ userList[i].img +'" class="imgUser" alt="image man">'+userList[i].user+'</div><img src="../img/notification.png" class="notif none" alt="notif"><img class="pointPoint" src="img/'+point+'"></div>');
	}
});

$('.power').click(function(){ //action de déconnexion
	decoClick();
})

function decoClick(){ //pour déconnecter le user en question
	let userName = $('#user').text();
	socket.emit('deconnexion', userName); //on envoit le user qui se déconnecte au serveur
	$('#popupCtn').css('display', 'flex');
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

socket.on('change notif', function(id){ //pour changer la notif du mec
	let recupImage = $('#'+id).find('.pointPoint').attr('src');
	if(recupImage == 'img/green.png'){
		//console.log('devient rouge');
		$('#'+id).find('.pointPoint').attr('src','img/red.png');
	} else {
		//console.log('devient vert');
		$('#'+id).find('.pointPoint').attr('src','img/green.png');
	}
});

$( "#rechercher" ).keyup(function(){ //quand le user tape sa recherche
	$("#membres").children().each(function(key, ele){ //on enlève tous les display en cas de retour arrière du user
		$(ele).css('display','flex');
	});
	
	texteRecup = $('#rechercher').val();
	tailleTexte = texteRecup.length;
	$("#membres").children().each(function(key, ele){ //pour chaque élément de la liste
		let texte = $(ele).text();
		for(let i = 0; i < tailleTexte; i++){
			if(texte[i] == texteRecup[i]){ //si les lettres sont les mêmes
				//rien
			}
			else{ //sinon on display none
				$(ele).css('display','none');
			}
		}
	});
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
		let messageForm = '';
		
		//définir les classes en fonction du user qui les envoit
		if(msg.id == socket.id){ //si le socket et l'expediteur ont le même id
			class1 = 'messageDetailRight';
			class2 = 'messageRight';
			class3 = 'userRight';
			if(msg.id == tableau[tableau.length - 2].id){
				messageForm = "<br/>" + msg.message;
				$(".rightMsg:last-child .msgMsg > .contentMsg").append(messageForm);
			}
			else{
				messageForm = "<div class='rightMsg'><div class='imgMsgCtn'><img src='"+msg.img+"' alt='Image utilisateur' class='imgMsg'></div><div class='msgMsg'><div class='nameCtn'><span>"+ msg.expediteur +"</span></div><span class='contentMsg lMsg'>"+ msg.message +"</span><span class='dateFrame'>" + msg.date + "</span></div>";
				$('#messages').append(messageForm);
			}
		}
		else{ //sinon
			class1 = 'messageDetailLeft';
			class2 = 'messageLeft';
			class3 = 'userLeft';
			if(msg.id == tableau[tableau.length - 2].id){
				messageForm = "<br/>" + msg.message;
				$(".leftMsg:last-child .msgMsg > .contentMsg").append(messageForm);
			}
			else{
				messageForm = "<div class='leftMsg'><div class='imgMsgCtn'><img src='"+msg.img+"' alt='Image utilisateur' class='imgMsg'></div><div class='msgMsg'><div class='nameCtn'><span>"+ msg.expediteur +"</span></div><span class='contentMsg rMsg'>"+ msg.message +"</span><span class='dateFrame'>" + msg.date + "</span></div>";
				$('#messages').append(messageForm);
			}
		}
		let elem = document.getElementById('messages');
		elem.scrollTop = elem.scrollHeight;
	}
});

socket.on('general', function(tableau,tableau2){ //les 20 derniers msg se chargent quand il revient sur le chat général
	if($('#general').hasClass('selected')){ //supprime notif
		$('#general .notif').addClass('none');
	}
	if($('#general').hasClass('selected')){ //si on est placé dans le canal général
		let messageForm = '';
		let taille = tableau.length;
		let taille2 = tableau2.length;
		
		if((tableau[taille - 1].connected != socket.id && tableau2[taille2 - 1].id != socket.id)){ //si le user vient de se conneter ou aller dans le canal général ou les deux
			//rien
		}
		else{	
			$('#messages').empty();
			//définir les classes en fonction du user qui les envoit
			for(let i = 0; i < tableau.length; i++){
				if(tableau[i].id == socket.id){ //si le socket et l'expediteur ont le même id
					if(tableau[i - 1].id == tableau[i].id){
						messageForm = "<br/>" + tableau[i].message;
						$(".rightMsg:last-child .msgMsg > .contentMsg").append(messageForm);
					}
					else{
						messageForm = "<div class='rightMsg'><div class='imgMsgCtn'><img src='"+tableau[i].img+"' alt='Image utilisateur' class='imgMsg'></div><div class='msgMsg'><div class='nameCtn'><span>"+ tableau[i].expediteur +"</span></div><span class='contentMsg lMsg'>"+ tableau[i].message +"</span><span class='dateFrame'>" + tableau[i].date + "</span></div>";
						$('#messages').append(messageForm);
					}
				}
				else if(tableau[i].id == 'serveur'){ //si id = 'serveur'
					messageForm = '<div class="serverMessage">'+ tableau[i].expediteur + ' ' + tableau[i].message +'</div>';
					$('#messages').append(messageForm);
				}
				else{ //sinon
					if(tableau[i - 1].id == tableau[i].id){
						messageForm = "<br/>" + tableau[i].message;
						$(".leftMsg:last-child .msgMsg > .contentMsg").append(messageForm);
					}
					else{
						messageForm = "<div class='leftMsg'><div class='imgMsgCtn'><img src='"+tableau[i].img+"' alt='Image utilisateur' class='imgMsg'></div><div class='msgMsg'><div class='nameCtn'><span>"+ tableau[i].expediteur +"</span></div><span class='contentMsg rMsg'>"+ tableau[i].message +"</span><span class='dateFrame'>" + tableau[i].date + "</span></div>";
						$('#messages').append(messageForm);
					}
				}
			}
			let elem = document.getElementById('messages');
			elem.scrollTop = elem.scrollHeight;
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
	if(!$('#'+dernierMsg).hasClass('selected') && dernierMsg != socket.id && destinataire == socket.id && notif==true){ //si on reçoit un message afficher une notif
		$('#'+dernierMsg).find('img').removeClass('none');
	}
	
	if(!$('#general').hasClass('selected')){ //si on n'est pas dans le chat général
		$('#messages').empty();
		let messageForm = '';
		
		for(let i = 0; i < tableau.length; i++){
			if((tableau[i].id == privateUser && tableau[i].destinataire == socket.id) || (tableau[i].id == socket.id && tableau[i].destinataire == privateUser)){ //si on est sur une conv privée en affiche les msg
				if(tableau[i].id == socket.id){ //si le socket et l'expediteur ont le même id
					if(tableau[i - 1].id == tableau[i].id){
						messageForm = "<br/>" + tableau[i].message;
						$(".rightMsg:last-child .msgMsg > .contentMsg").append(messageForm);
					}
					else{
						messageForm = "<div class='rightMsg'><div class='imgMsgCtn'><img src='"+tableau[i].img+"' alt='Image utilisateur' class='imgMsg'></div><div class='msgMsg'><div class='nameCtn'><span>"+ tableau[i].expediteur +"</span></div><span class='contentMsg lMsg'>"+ tableau[i].message +"</span><span class='dateFrame'>" + tableau[i].date + "</span></div>";
						$('#messages').append(messageForm);
					}
				}
				else{ //sinon
					if(tableau[i - 1].id == tableau[i].id){
						messageForm = "<br/>" + tableau[i].message;
						$(".leftMsg:last-child .msgMsg > .contentMsg").append(messageForm);
					}
					else{
						messageForm = "<div class='leftMsg'><div class='imgMsgCtn'><img src='"+tableau[i].img+"' alt='Image utilisateur' class='imgMsg'></div><div class='msgMsg'><div class='nameCtn'><span>"+ tableau[i].expediteur +"</span></div><span class='contentMsg rMsg'>"+ tableau[i].message +"</span><span class='dateFrame'>" + tableau[i].date + "</span></div>";
						$('#messages').append(messageForm);
					}				
				}
			}
		}
		let elem = document.getElementById('messages');
		elem.scrollTop = elem.scrollHeight;
	}
});

socket.on('enter private message', function(tableau){ //afficher les messages privés des conv
	$('#rechercher').val('');
	$("#membres").children().each(function(key, ele){ //on display toute la liste en cas de recherche
		$(ele).css('display','flex');
	});
	if(!$('#general').hasClass('selected')){ //si on n'est pas dans le chat général
		let messageForm = '';
		$('#messages').empty();
		
		for(let i = 0; i < tableau.length; i++){
			if((tableau[i].id == privateUser && tableau[i].destinataire == socket.id) || (tableau[i].id == socket.id && tableau[i].destinataire == privateUser)){ //si on est sur une conv privée en affiche les msg
				if(tableau[i].id == socket.id){ //si le socket et l'expediteur ont le même id
					if(tableau[i - 1].id == tableau[i].id){
						messageForm = "<br/>" + tableau[i].message;
						$(".rightMsg:last-child .msgMsg > .contentMsg").append(messageForm);
					}
					else{
						messageForm = "<div class='rightMsg'><div class='imgMsgCtn'><img src='"+tableau[i].img+"' alt='Image utilisateur' class='imgMsg'></div><div class='msgMsg'><div class='nameCtn'><span>"+ tableau[i].expediteur +"</span></div><span class='contentMsg lMsg'>"+ tableau[i].message +"</span><span class='dateFrame'>" + tableau[i].date + "</span></div>";
						$('#messages').append(messageForm);
					}
				}
				else{ //sinon
					if(tableau[i - 1].id == tableau[i].id){
						messageForm = "<br/>" + tableau[i].message;
						$(".leftMsg:last-child .msgMsg > .contentMsg").append(messageForm);
					}
					else{
						messageForm = "<div class='leftMsg'><div class='imgMsgCtn'><img src='"+tableau[i].img+"' alt='Image utilisateur' class='imgMsg'></div><div class='msgMsg'><div class='nameCtn'><span>"+ tableau[i].expediteur +"</span></div><span class='contentMsg rMsg'>"+ tableau[i].message +"</span><span class='dateFrame'>" + tableau[i].date + "</span></div>";
						$('#messages').append(messageForm);
					}				
				}
			}
		}
		let elem = document.getElementById('messages');
		elem.scrollTop = elem.scrollHeight;
	}
});

socket.on('co affiche', connexion => { //en cas de connexion
	$('#messages').append('<div class="serverMessage">'+ connexion.expediteur +' est entré(e) dans le salon</div>');
});

socket.on('deco affiche', deconnexion => { //en cas de déconnexion
	$('#messages').append('<div class="serverMessage">'+ deconnexion.expediteur +' a quitté le salon</div>');
});
