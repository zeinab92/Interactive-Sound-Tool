if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
    //If Safari Browser
   $(".draggable").on("vmousedown", function() { 
      $(this).children(".audio").trigger("play"); 
   });

   $(".draggable").on("vmouseup", function() { 
      $(this).children(".audio").trigger("pause"); 
   });
    
    $(".wrapper").addClass("safari-browser");
}
else {
    //Do the normal audio triggering in all other browsers
}

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $(".wrapper").css("display", "none");
}

// target elements with the "draggable" class
interact('.draggable')
    .draggable({
        // enable inertial throwing
        inertia: true,
        onmove: window.dragMoveListener,
        // keep the element within the area of it's parent
        restrict: {
            restriction: 'parent',
            elementRect: { left: 0, right: 1, top: 0, bottom: 1 }
        },

        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
            event.target.classList.remove("dragging");
            $(".audio").trigger("pause");
            
            if ($(".draggable").hasClass("can-drop")) {
                //Don't snap icon back because it was dropped into drop zone
            }
            else {
                //Snap icon back to original position
                $(".draggable").removeAttr('data-x');
                $(".draggable").removeAttr('data-y');
                $(".draggable").css('transform', 'none');
                $(".draggable").css('transition', 'all 1s');
                $(".ribbon.expand").addClass("remove-expand");
                setTimeout(function () {
                    $(".safari-browser .ribbon.expand").removeClass("remove-expand");
                    $(".safari-browser .ribbon.expand").removeClass("expand");
                }, 500);
                setTimeout(function () {
                    $(".draggable").css('transition', 'opacity 1s');
                    $(".ribbon.expand").removeClass("remove-expand");
                    $(".ribbon.expand").removeClass("expand");
                }, 1400);
            }
        }
    });

function dragMoveListener(event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    target.children[1].play();
    $(".ribbon").addClass("expand");
    target.classList.add("dragging");
    if ($(".dragging").hasClass("jackhammer-icon")) {
        $(".parent-span").html("96.0<span style='margin-left:2.5px;'>dBA</span>")
    }
    else if ($(".dragging").hasClass("crowd-icon")) {
        $(".parent-span").html("110.0<span style='margin-left:2.5px;'>dBA</span>")
    }
    else if ($(".dragging").hasClass("tractor-icon")) {
        $(".parent-span").html("102.0<span style='margin-left:2.5px;'>dBA</span>")
    }
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;
/* The dragging code for '.draggable' from the demo above
 * applies to this demo as well so it doesn't have to be repeated. */

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '.drag-drop',

    // Require a 30% element overlap for a drop to be possible
    overlap: 0.30,

    // listen for drop related events:

    ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');
    },
    ondragenter: function (event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;

        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
    },
    ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
        $("#myAudio").animate({
            volume: 1
        }, 1000);
    },
    ondrop: function (event) {
        var counter;
        if (event.relatedTarget.classList.contains("jackhammer-icon")) {
            var number = 96.0;
            var decrement = function(){
                number -= 0.1;
                $('.parent-span').html(number.toFixed(1) + '<span style="margin-left:2.5px;">dBA</span>');
                if (number <= 86.1){
                    clearInterval(counter);
                }
            }
        }
        if (event.relatedTarget.classList.contains("crowd-icon")) {
            var number = 110.0;
            var decrement = function(){
                number -= 0.1;
                $('.parent-span').html(number.toFixed(1) + '<span style="margin-left:2.5px;">dBA</span>');
                if (number <= 100.1){
                    clearInterval(counter);
                }
            }
        }
        if (event.relatedTarget.classList.contains("tractor-icon")) {
            var number = 102.0;
            var decrement = function(){
                number -= 0.1;
                $('.parent-span').html(number.toFixed(1) + '<span style="margin-left:2.5px;">dBA</span>');
                if (number <= 92.1){
                    clearInterval(counter);
                }
            }
        }
        $(".can-drop audio").trigger("play");
        $(".audio").animate({
            volume: 0.1
        }, 1000);
        $(".can-drop").addClass("dropped");
        $(".box").addClass("drop");
        $(".box-shadow").addClass("drop");
        $(".ribbon-wrapper").addClass("drop");
        $(".ribbon").addClass("expand");
        $(".expand .parent-span").css("transition", "none");
        $(".cant-drag").addClass("on");
        counter = setInterval(decrement, 8);
        setTimeout(function () {
            $(".can-drop").removeClass("dropped");
            $(".can-drop").css("opacity", 0);
            $(".audio").animate({
                volume: 0
            }, 1000);
            $(".can-drop").removeAttr('data-x');
            $(".can-drop").removeAttr('data-y');
        }, 2500);
        setTimeout(function () {
            $(".audio").trigger("pause");
            $(".box").removeClass("drop");
            $(".can-drop").css("transform", "");
            $(".box-shadow").removeClass("drop");
            $(".ribbon-wrapper").removeClass("drop");
            $(".audio").animate({
                volume: 1
            }, 1000);
        }, 3350);
        setTimeout(function () {
            $(".ribbon.expand").addClass("remove-expand");
            $(".can-drop").css("opacity", 1);
            $(".drag-drop").removeClass("can-drop");
        }, 3800);
        
        setTimeout(function (){
            $(".parent-span").css("transition", "opacity 0.5s linear 0.5s");
            $(".ribbon.expand").removeClass("remove-expand");
            $(".ribbon.expand").removeClass("expand");
            $(".cant-drag").removeClass("on");
        }, 4500);
    },
    ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
    }
});