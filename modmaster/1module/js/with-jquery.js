/**
 * navigation, hash, sections and menu
 */
jQuery(document).ready(function($) {
    //hash click -> animate to section
    $("a[href^='#']").click(function(){
        var elem = $('section[data-section-name="'+this.hash.substring(1)+'"]');
        elem = elem.length ? elem : $(this.hash);
        if( !elem.length )return;
        $('html,body').animate({scrollTop:elem.offset().top},1000);
        return false;
    });
    //add external icon to all external link
    $("a").not("[href^='#']").each(function(){
        $(this).append('&nbsp;<i class="fa fa-external-link"></i>');
    });

    var curHash = "";
    $(document).bind('scroll',function(){
        $('section').each(function(){
            if ( $(this).offset().top < window.pageYOffset + 10
                && $(this).offset().top + $(this).height() > window.pageYOffset + 10
                && $(this).data('section-name') != curHash
                ) {
                window.location.hash = curHash = ( $(this).data('section-name') );
                $(document).trigger('section-change', this);
            }
        });
    });
    var lastSection = {};
    $(document).on('section-change', function(e, section) {
        $(lastSection)
            .removeClass('fa-circle')
            .addClass('fa-circle-o')
        ;
        lastSection = $('nav')
            .find('a[href="#'+ $(section).attr('id') +'"]')
            .find('.fa')
            .removeClass('fa-circle-o')
            .addClass('fa-circle')
        ;
    });

//    var menuIsActive = false;
    $('nav').css('display','none');
//    $('#showRight').on('click', function() {
//        $('nav').css('display',menuIsActive? 'none': 'block');
//        menuIsActive = !menuIsActive;
//    });


    // contact form
    $('#contact-submit').on('click', function() {
        var email = $('#input-email').val(),
            subject = $('#input-subject').val() || "",
            message = $('#input-message').val(),
            re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if( !re.test(email) ) return false;
        var icon = $('#contact-submit i');
        icon.removeClass('fa-paper-plane');
        icon.addClass('fa-spinner fa-spin');
        NProgress.start();
        NProgress.set(0.4);
        $.ajax({
            type: 'POST',
            url: 'https://mandrillapp.com/api/1.0/messages/send.json',
            data: {
                'key': 'OFCWI9QKxH5Ke3Yh14KVQQ',
                'message': {
                    'from_email': email,
                    'to': [
                        {
                            'email': 'manaleck@yahoo.de',
                            'name': 'supermarlon.de Formular',
                            'type': 'to'
                        }
                    ],
                    'autotext': 'true',
                    'subject': 'sm.de - ' + subject,
                    'text': message
                }
            }
        }).done(function(response) {
            NProgress.done();
            icon.removeClass('fa-spinner fa-spin');
            icon.addClass('fa-check');
            setTimeout(function() {
                icon.removeClass('fa-check');
                icon.addClass('fa-paper-plane');
            }, 5000);
            $('#input-email').val("");
            $('#input-subject').val("");
            $('#input-message').val("");
        });

        return false;

    });

    // contact form background image
    var imgSrc = "http://res.cloudinary.com/datqsjpac/image/upload/v1420338644/contact_nlho7g.png";
    $('<img/>').attr('src', imgSrc).load(function() {
        $(this).remove(); // prevent memory leaks as @benweet suggested
        $('#contact').css('background-image', 'url('+ imgSrc +')');
    });
});

