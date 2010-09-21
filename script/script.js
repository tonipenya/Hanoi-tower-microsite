/*
 * TODO:
 * - Animation for droping.
 * - Pass ids to functions instead of pegs and discs. (not sure)
 * - Change size, margins and position of #hanoi according to the ammount of .hanoi-disks
 **/
var pegs = {};
var defaultPeg = 'peg1';
var lastGameCompletePegId = defaultPeg;

$(function() {
    $('#hanoi').css('visibility', 'visible');

    // Define dragables
    $(".hanoi_disk").draggable({
        revert: "invalid"
    });

    initPegs();
    resizeDisks();
    initDisks();

    $(".hanoi_peg").droppable({
        drop: processDiskDrop,
        accept: isAcceptable,
        tolerance: 'touch'
    });

});

function initPegs() {
    $(".hanoi_peg").each(function() {
        var pegId = $(this).attr('id');
        pegs[pegId] = {};
    });
}

function initDisks() {
    $($(".hanoi_disk").get().reverse()).each(function() {
        var diskId=$(this).attr('id');

        pegs[defaultPeg][diskId] = $(this);
        placeDiskOnPeg($(this), $('#'+defaultPeg));
    });
}

function resizeDisks() {
    var size = 270;
    var step = 25;
    $($(".hanoi_disk").get().reverse()).each(function() {
        $(this).width(size);
        size -= step;
    });
}

function processDiskDrop(event, ui) {
    var droppable = $(this);
    var disk = ui.draggable;
    var pegId = droppable.attr('id');
    var peg = pegs[pegId];

    removeDiskFromPegs(disk);
    addDiskToPeg(disk, peg);
    placeDiskOnPeg(disk, droppable);

    checkGameEnd();
}

function isAcceptable(dragable) {
    var pegId = $(this).attr('id');
    var peg = pegs[pegId];

    return isOnTop(dragable) && isTheNarrowestInPeg(dragable, peg);
}

function removeDiskFromPegs(disk) {
    var diskId = disk.attr('id');

    for (var pegKey in pegs) {
        delete pegs[pegKey][diskId];
    }
}

function addDiskToPeg(disk, peg) {
    var diskId = disk.attr('id');
    peg[diskId] = disk;

}

function placeDiskOnPeg(disk, droppable) {
    var pegId = droppable.attr('id');
    var peg = pegs[pegId];
    var pegBottom = droppable.offset().top + droppable.height();

    var top = pegBottom;

    for (var diskKey in peg) {
        top-= peg[diskKey].outerHeight();
    }

    var left = droppable.offset().left + (droppable.width()-disk.outerWidth())/2;

    disk.offset({
        top:top,
        left:left
    });
}

function isOnTop(disk) {
    for (var pegKey in pegs) {
        var peg = pegs[pegKey];

        if(isOnPeg(disk, peg) && isTheNarrowestInPeg(disk, peg)) {
            return true;
        }
    }

    return false;
}

function isTheNarrowestInPeg(disk, peg) {
    var diskWidth = disk.width();

    for(var diskKey in peg) {
        if(peg[diskKey].width() < diskWidth) {
            return false;
        }
    }

    return true;
}

function isOnPeg(disk, peg) {
    var diskId = disk.attr('id');

    return diskId in peg;
}

function checkGameEnd() {
    var elementsInPeg = false;
    var finalPegId;

    for (var pegKey in pegs) {
        var peg = pegs[pegKey];

        for (var diskKey in peg) {
            if(elementsInPeg) {
                return;
            }

            elementsInPeg = true;
            finalPegId = pegKey;
            break;
        }
    }

    if(finalPegId != lastGameCompletePegId) {
        alert('Yay, You made it!');
        lastGameCompletePegId = finalPegId;
    }
}