
//initialisation des variables
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static('public')); //on utilise le dossier public

const userList = [];
const msgEnvoiGeneral = [];
const msgEnvoiPrivate = [{id:'test',message:'test',expediteur:'test',destinataire:'test'},{id:'test',message:'test',expediteur:'test',destinataire:'test'}]; //laisser les 2 msg
const returnGeneral = [];

io.on('connection', function(socket){ //nouvelle connexion
	console.log('Nouvelle connexion');
  
	socket.on('chat message', function(msg, date) { //lorsqu'on envoit un message
		let userName = '';
		let msgEnvoi = '';
		for(let i = 0; i < userList.length; i++){
			if((userList[i].id) == (socket.id)){ //on cherche le nom de l'expediteur dans notre tableau des users
				userName = userList[i].user;
				img = userList[i].img;
				msgEnvoi = {id:socket.id,message:msg,expediteur:userName,img:img,date:date};
				msgEnvoiGeneral.push(msgEnvoi); //renvoit en Json les infos du message
				if(msgEnvoiGeneral.length > 20){ //si il a plus de 20 messages dans le chat général
					msgEnvoiGeneral.shift();
				}
				io.emit('chat message', msgEnvoi, msgEnvoiGeneral, userList);
			}
		}
		console.log(msgEnvoiGeneral);
	});
  
	socket.on('user', function(user, img) { //ajout d'un nouvel utilisateur
		let connexion = '';
		if(!userList.find(user => user.id === socket.id)){
			userList.push({id:socket.id,user:user,img:img,notif:true});
			for(let i = 0; i < userList.length; i++){
				if((userList[i].id) == (socket.id)){ //on cherche le nom de l'expediteur dans notre tableau des users
					userName = userList[i].user;
					connexion = {id:'serveur',message:'est entré(e) dans le salon',expediteur:userName,connected:socket.id};
					msgEnvoiGeneral.push(connexion); //renvoit en Json les infos du message
					if(msgEnvoiGeneral.length > 20){ //si il a plus de 20 messages dans le chat général
						msgEnvoiGeneral.shift();
					}
				}
			}
		}
		//console.log(userList);
		io.emit('list', userList);
		io.emit('co affiche', connexion);
	});
  
	socket.on('private message', function(message,idPrivate, date) { //pour envoyer un message privé
		let userName = '';
		for(let i = 0; i < userList.length; i++){
			if((userList[i].id) == (socket.id)){ //on cherche le nom de l'expediteur dans notre tableau des users
				userName = userList[i].user;
				img = userList[i].img;
				msgEnvoiPrivate.push({id:socket.id,message:message,expediteur:userName,destinataire:idPrivate,img:img,date:date}); //renvoit en Json les infos du message
				io.emit('private message', msgEnvoiPrivate, userList);
				//io.to(idPrivate).emit(msgEnvoiPrivate);
			}
		}
		//console.log(msgEnvoiPrivate);
	});
	
	socket.on('enter private message', function(click) { //pour arriver sur une conv privée
		if(click == true){
			io.emit('enter private message', msgEnvoiPrivate); //on renvoit le tableau des messages privés
		}
		//console.log(msgEnvoiPrivate);
	});
	
	socket.on('typing', typing => { //pour renvoyer si le user tape ou non
		let userName = '';
		for(let i = 0; i < userList.length; i++){
			if((userList[i].id) == (socket.id)){ //on cherche le nom de l'expediteur dans notre tableau des users
				userName = userList[i].user;
			}
		}
		//on envoit le tableau au client
		const barre = [];
		barre.push({user:userName,typing:typing,id:socket.id});
		io.emit('display', barre);
		//console.log(barre);
	});
	
	socket.on('deconnexion', userName => { //pour renvoyer si se déconnecte
		let deconnexion = '';
		for(let i = 0; i < userList.length; i++){
			if((userList[i].id) == (socket.id)){ //on cherche le nom de l'expediteur dans notre tableau des users
				let supprimeUser = userList.splice(i, 1);
				deconnexion = {id:'serveur',message:'a quitté le salon',expediteur:userName};
				msgEnvoiGeneral.push(deconnexion); //renvoit en Json les infos du message
				if(msgEnvoiGeneral.length > 20){ //si il a plus de 20 messages dans le chat général
					msgEnvoiGeneral.shift();
				}
			}
		}
		io.emit('deco affiche', deconnexion);
		io.emit('list', userList); //on renvoit le nouveau tableau des users
		//console.log(userList);
	});
	
	socket.on('general', click => { //pour renvoyer les messages généraux
		if(click == true){
			returnGeneral.push({id:socket.id});
			io.emit('general', msgEnvoiGeneral, returnGeneral); //on renvoit le tableau des messages general
		}
	});
	
	socket.on('notifications', click => { //changer l'etat des notifications (on/off)
		if(click == true){
			for(let i = 0; i < userList.length; i++){
				if(userList[i].id == socket.id){
					let notif = userList[i].notif;
					if(notif == true){
						userList[i].notif = false;
					}
					else{
						userList[i].notif = true;
					}
				}
			}
		}
		//console.log(userList);
	});
});

http.listen(port, function(){ //vérifier sur quel port écoute le serveur
	console.log('listening on *:' + port);
});
