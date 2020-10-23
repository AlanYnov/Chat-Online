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
})

$('.categoryTwo').click(function(){
    $('.emoOne').css('display', 'none');
    $('.emoTwo').css('display', 'flex');
    $('.emoThree').css('display', 'none');
    $('.emoFour').css('display', 'none');
    $('.emoFive').css('display', 'none');
})

$('.categoryThree').click(function(){
    $('.emoOne').css('display', 'none');
    $('.emoTwo').css('display', 'none');
    $('.emoThree').css('display', 'flex');
    $('.emoFour').css('display', 'none');
    $('.emoFive').css('display', 'none');
})

$('.categoryFour').click(function(){
    $('.emoOne').css('display', 'none');
    $('.emoTwo').css('display', 'none');
    $('.emoThree').css('display', 'none');
    $('.emoFour').css('display', 'flex');
    $('.emoFive').css('display', 'none');
})

$('.categoryFive').click(function(){
    $('.emoOne').css('display', 'none');
    $('.emoTwo').css('display', 'none');
    $('.emoThree').css('display', 'none');
    $('.emoFour').css('display', 'none');
    $('.emoFive').css('display', 'flex');
})

$('.catico').click(function(){
    $('.catico').css('color', 'black');
    $(this).css('color', '#318ce7');
})