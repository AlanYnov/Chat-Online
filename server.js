
//initialisation des variables
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static('public')); //on utilise le dossier public

const userList = [];
const msgEnvoiGeneral = [];
const msgEnvoiPrivate = [];

io.on('connection', function(socket){ //nouvelle connexion
	console.log('Nouvelle connexion');
  
	socket.on('chat message', function(msg) { //lorsqu'on envoit un message
		let userName = '';
		let msgEnvoi = '';
		for(let i = 0; i < userList.length; i++){
			if((userList[i].id) == (socket.id)){ //on cherche le nom de l'expediteur dans notre tableau des users
				userName = userList[i].user;
				msgEnvoi = {id:socket.id,message:msg,expediteur:userName};
				msgEnvoiGeneral.push(msgEnvoi); //renvoit en Json les infos du message
				if(msgEnvoiGeneral.length > 20){ //si il a plus de 20 messages dans le chat général
					msgEnvoiGeneral.shift();
				}
				io.emit('chat message', msgEnvoi);
			}
		}
		//console.log(msgEnvoiGeneral);
	});
  
	socket.on('user', (user) => { //ajout d'un nouvelle utilisateur
		if(!userList.find(user => user.id === socket.id)){
			userList.push({id:socket.id,user:user});
			io.emit('new user', userList);
			console.log(userList);
		};
	});
  
	socket.on('private message', function(message,idPrivate) { //pour envoyer un message privé
		let userName = '';
		for(let i = 0; i < userList.length; i++){
			if((userList[i].id) == (socket.id)){ //on cherche le nom de l'expediteur dans notre tableau des users
				userName = userList[i].user;
				msgEnvoiPrivate.push({id:socket.id,message:message,expediteur:userName,destinataire:idPrivate}); //renvoit en Json les infos du message
				io.emit('private message', msgEnvoiPrivate);
				//io.to(idPrivate).emit(msgEnvoiPrivate);
			}
		}
		console.log(msgEnvoiPrivate);
	});
	
	socket.on('enter private message', function(click) { //pour arriver sur une conv privée
		if(click == true){
			io.emit('enter private message', msgEnvoiPrivate); //on renvoit le tableau des messages privés
		}
		console.log(msgEnvoiPrivate);
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
		for(let i = 0; i < userList.length; i++){
			if((userList[i].id) == (socket.id)){ //on cherche le nom de l'expediteur dans notre tableau des users
				let supprimeUser = userList.splice(i, 1);
			}
		}
		io.emit('deconnexion', userList); //on renvoit le nouveau tableau des users
		console.log(userList);
	});
	
	socket.on('general', click => { //pour renvoyer les messages généraux
		if(click == true){
			io.emit('general', msgEnvoiGeneral); //on renvoit le tableau des messages general
		}
		console.log(msgEnvoiGeneral);
	});
});

http.listen(port, function(){ //vérifier sur quel port écoute le serveur
	console.log('listening on *:' + port);
});
