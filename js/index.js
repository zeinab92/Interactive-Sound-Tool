// target elements with the "draggable" class
interact('.draggable')
    .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: {
                top: 0,
                left: 0,
                bottom: 1,
                right: 1
            }
        },
        // enable autoScroll
        autoScroll: true,

        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
            event.target.classList.remove("dragging");
            $(".audio").trigger("pause");
            $(".ribbon").removeClass("expand");
            var textEl = event.target.querySelector('p');

            textEl && (textEl.textContent =
                'moved a distance of ' +
                (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                    Math.pow(event.pageY - event.y0, 2) | 0))
                .toFixed(2) + 'px');
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
        $(".parent-span").html("96.0 <span>dBA</span>")
    }
    else if ($(".dragging").hasClass("crowd-icon")) {
        $(".parent-span").html("110.0 <span>dBA</span>")
    }
    else if ($(".dragging").hasClass("tractor-icon")) {
        $(".parent-span").html("102.0 <span>dBA</span>")
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

    // Require a 75% element overlap for a drop to be possible
    overlap: 0.60,

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
                // Just logging the results to make sure it works
                number -= 0.1;
                $('.parent-span').html(number.toFixed(1) + ' <span>dBA</span>');
                if (number <= 86.1){
//                    number--;
                    clearInterval(counter);
                }
            }
        }
        if (event.relatedTarget.classList.contains("crowd-icon")) {
            var number = 110.0;
            var decrement = function(){
                // Just logging the results to make sure it works
                number -= 0.1;
                $('.parent-span').html(number.toFixed(1) + ' <span>dBA</span>');
                if (number <= 100.1){
                    clearInterval(counter);
                }
            }
        }
        if (event.relatedTarget.classList.contains("tractor-icon")) {
            var number = 102.0;
            var decrement = function(){
                // Just logging the results to make sure it works
                number -= 0.1;
                $('.parent-span').html(number.toFixed(1) + ' <span>dBA</span>');
                if (number <= 92.1){
                    clearInterval(counter);
                }
            }
        }
        $(".can-drop audio").trigger("play");
        $(".audio").animate({
            volume: 0.1
        }, 1000);
        $(".box").addClass("drop");
        $(".box-shadow").addClass("drop");
        $(".ribbon-wrapper").addClass("drop");
        $(".ribbon").addClass("expand");
        $(".expand .parent-span").css("transition", "none");
        counter = setInterval(decrement, 8);
        setTimeout(function () {
            $(".can-drop").css("opacity", 0);
            $(".audio").animate({
                volume: 0
            }, 1000);
            $(".can-drop").removeAttr('data-x');
            $(".can-drop").removeAttr('data-y');
        }, 5000);
        setTimeout(function () {
            $(".audio").trigger("pause");
            $(".box").removeClass("drop");
            $(".can-drop").css("transform", "");
            $(".box-shadow").removeClass("drop");
            $(".ribbon-wrapper").removeClass("drop");
            $(".audio").animate({
                volume: 1
            }, 1000);
        }, 6000);
        setTimeout(function () {
            $(".ribbon.expand").addClass("remove-expand");
            $(".can-drop").css("opacity", 1);
            $(".drag-drop").removeClass("can-drop");
        }, 6500);
        setTimeout(function (){
            $(".parent-span").css("transition", "opacity 0.5s linear 0.5s");
            $(".ribbon.expand").removeClass("remove-expand");
            $(".ribbon.expand").removeClass("expand");
        }, 9000);
    },
    ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
    }
});