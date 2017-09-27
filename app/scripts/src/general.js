$(document).ready(function () {
    $('.single__collapse__body').hide();
    $('.single__collapse__button').click(function () {
        $(this).siblings('.single__collapse__body').slideToggle();
        $(this).children('.icon-elem').toggleClass('animate');
    });

    $('#search-deployer').on('click', function(){
        $('#search-deploy').delay(4000).toggleClass('active');
        $(this).toggleClass('inactive');
    });

    $('.infography__figure').hover(function(){
        $(this).children('figcaption').delay('500').toggleClass('visible');
    });

    $('.infography__figure').hover(function () {
        var $t = $(this);
        var $i = $('#' + $t.data('id'));
        // find offset positions for the word (t = this) and image (i)
        var ot = {
            x: $t.offset().left + $t.width() / 2,
            y: $t.offset().top + $t.height() / 2
        };
        var oi = {
            x: $i.offset().left + $i.width() / 2,
            y: $i.offset().top + $i.height() / 2
        };
        // x,y = top left corner
        // x1,y1 = bottom right corner
        var p = {
            x: ot.x < oi.x ? ot.x : oi.x,
            x1: ot.x > oi.x ? ot.x : oi.x,
            y: ot.y < oi.y ? ot.y : oi.y,
            y1: ot.y > oi.y ? ot.y : oi.y
        };
        // create canvas between those points
        var c = $('<canvas/>').attr({
            'width': p.x1 - p.x,
            'height': p.y1 - p.y
        }).css({
            'position': 'absolute',
            'left': p.x,
            'top': p.y,
            'z-index': 1
        }).appendTo($('body'))[0].getContext('2d'); 
        // draw line
        c.strokeStyle = '#092334';
        c.lineWidth = 4;
        c.beginPath();
        c.moveTo(ot.x - p.x, ot.y - p.y);
        c.lineTo(oi.x - p.x, oi.y - p.y);
        // c.bezierCurveTo(20,100,20,100,p.x,p.y);
        c.stroke();
    }, function () {
        $('canvas').remove();
    });

    var lastId,
        topMenu = $(".sidebar__indice"),
        topMenuHeight = topMenu.outerHeight(),
        // All list items
        menuItems = topMenu.find("a"),
        // Anchors corresponding to menu items
        scrollItems = menuItems.map(function(){
            var item = $($(this).attr("href"));
            if (item.length) { return item; }
        });

    $(window).scroll(function(){
        // Get container scroll position
        var fromTop = $(this).scrollTop()+topMenuHeight;

        // Get id of current scroll item
        var cur = scrollItems.map(function(){
            if ($(this).offset().top < fromTop)
            return this;
        });
        // Get the id of the current element
        cur = cur[cur.length-1];
        var id = cur && cur.length ? cur[0].id : "";

        if (lastId !== id) {
            lastId = id;
            // Set/remove active class
            menuItems
                .parent().removeClass("sidebar__item--current")
                .end().filter("[href='#"+id+"']").parent().addClass("sidebar__item--current");
        }
    });
    
    $('[data-module="audio-js"]').audio();
    $('[data-module="stickyParent"]').stick_in_parent();
});