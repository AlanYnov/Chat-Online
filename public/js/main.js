document.addEventListener('DOMContentLoaded', function() {
    if (window.chrome) {
        $('.pointPoint').css('width', '1px');
    }
  });

//les tableaux des emojis
const smileysTab = ['128540','128513','128514','128515','128516','128517','128518','128519','128521','128522','128523','128524','128525','128526','128527','128528','128529','128530','128531','128532','128533'];
const animalsTab = ['128060','128059','128058','128057','128056','128055','128054','128053','128052','128051','128050','128049','128048','128047','128046','128045','128044','128043','128035','128030','128024'];
const sportsTab = ['127918','127919','127921','127923','127928','127934','127935','127936','127938','127939','127940','127943','127944','127945','127946','127947','127949','127951','127952','127954','127955'];
const foodTab = ['127789','127790','127828','127829','127830','127831','127836','127837','127839','127843','127846','127849','127851','127853','127856','127859','127866','127813','127814','127820','127825'];
const flagsTab = ['127744','127746','127748','127749','127752','127754','127755','127756','127757','127760','127761','127763','127765','127767','127769','127771','127772','127773','127774','127775','127776'];

//on génère tous les emojis de chaque catégorie
for(let i = 0; i < smileysTab.length; i++){
	$('.emoOne').append('<div class="emojiFrame"><span class="emoji">&#'+ smileysTab[i] +';</span></div>');
}
for(let i = 0; i < animalsTab.length; i++){
	$('.emoTwo').append('<div class="emojiFrame"><span class="emoji">&#'+ animalsTab[i] +';</span></div>');
}
for(let i = 0; i < sportsTab.length; i++){
	$('.emoThree').append('<div class="emojiFrame"><span class="emoji">&#'+ sportsTab[i] +';</span></div>');
}
for(let i = 0; i < foodTab.length; i++){
	$('.emoFour').append('<div class="emojiFrame"><span class="emoji">&#'+ foodTab[i] +';</span></div>');
}
for(let i = 0; i < flagsTab.length; i++){
	$('.emoFive').append('<div class="emojiFrame"><span class="emoji">&#'+ flagsTab[i] +';</span></div>');
}

$('#username').click(function(){
	$('#username').css('border', 'solid 1px grey');
});

$(".emojiFrame").click(function(){
    let target = $("#m");
    let smile = $(this).text();
    myText = target.val() + smile
    target.val( myText );
});

$("html, body").click(function(e) {
    if ($(e.target).hasClass('catico') || $(e.target).hasClass('emoCatCtn')) {
        return false;
    }
    $('.emojiPicker').css('display', 'none');
    $('.emojiPicker').addClass('hideEmoji');
});

$('#smileBtn').click(function(event){
    $('.emoOne').css('display', 'flex');
    $('.emoTwo').css('display', 'none');
    $('.emoThree').css('display', 'none');
    $('.emoFour').css('display', 'none');
    $('.emoFive').css('display', 'none');
    $('.catico').css('color', 'black');
    $('.categoryOne .emojiCat .catico').css('color', '#318ce7');
    if($('.hideEmoji')[0]){
        $('.emojiPicker').css('display', 'flex');
        $('.emojiPicker').removeClass('hideEmoji');
    }
    else {
        $('.emojiPicker').css('display', 'none');
        $('.emojiPicker').addClass('hideEmoji');
    }
    event.stopPropagation();
});

$('.categoryOne').click(function(){
    $('.emoOne').css('display', 'flex');
    $('.emoTwo').css('display', 'none');
    $('.emoThree').css('display', 'none');
    $('.emoFour').css('display', 'none');
    $('.emoFive').css('display', 'none');
});

$('.categoryTwo').click(function(){
    $('.emoOne').css('display', 'none');
    $('.emoTwo').css('display', 'flex');
    $('.emoThree').css('display', 'none');
    $('.emoFour').css('display', 'none');
    $('.emoFive').css('display', 'none');
});

$('.categoryThree').click(function(){
    $('.emoOne').css('display', 'none');
    $('.emoTwo').css('display', 'none');
    $('.emoThree').css('display', 'flex');
    $('.emoFour').css('display', 'none');
    $('.emoFive').css('display', 'none');
});

$('.categoryFour').click(function(){
    $('.emoOne').css('display', 'none');
    $('.emoTwo').css('display', 'none');
    $('.emoThree').css('display', 'none');
    $('.emoFour').css('display', 'flex');
    $('.emoFive').css('display', 'none');
});

$('.categoryFive').click(function(){
    $('.emoOne').css('display', 'none');
    $('.emoTwo').css('display', 'none');
    $('.emoThree').css('display', 'none');
    $('.emoFour').css('display', 'none');
    $('.emoFive').css('display', 'flex');
});

$('.catico').click(function(){
    $('.catico').css('color', 'black');
    $(this).css('color', '#318ce7');
});

$('.fa-smile').css('color', '#318ce7');