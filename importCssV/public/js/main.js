// $('.btn').click(function(){
//     $('#global').css('display', 'flex');
//     $('#mainCtn').css('display', 'none');
// })

$('#username').click(function(){
	$('#username').css('border', 'solid 1px grey');
});

$('#notification').click(function(){
    if($('.active')[0]){
        $('#notification').attr('src', 'img/bell.png')
        $('#notification').removeClass('active')
    } else{
        $('#notification').attr('src', 'img/bell1.png')
        $('#notification').addClass('active')
    }
});

$(".emojiFrame").click(function(){
    let target = $("#m");
    let smile = $(this).text();
    myText = target.val() + smile
    target.val( myText );
})

$(document).click(function() {
    $('.emojiPicker').css('display', 'none');
    $('.emojiPicker').addClass('hideEmoji');
});

$('#smileBtn').click(function(event){
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