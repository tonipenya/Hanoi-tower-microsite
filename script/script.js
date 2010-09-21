/*
 * TODO:
 * - Animation for droping.
 * - Pass ids to functions instead of pegs and discs. (not sure)
 **/
var pegs = {};

$(function() {
    // Define dragables
    $(".hanoi_disk").draggable({
        revert: "invalid"
    });
	
    initPegs();
    resizeDisks();
    initDisks();

    $(".hanoi_peg").droppable({
        drop: processDiskDrop,
        accept: setAcceptCriterea
    });

    printDebug();
});

function initPegs() {
    $(".hanoi_peg").each(function() {
        var pegId = $(this).attr('id');
        pegs[pegId] = {};
    });
}

function initDisks() {
    $(".hanoi_disk").each(function() {
        var diskId=$(this).attr('id');
        pegs['peg1'][diskId] = $(this);

        placeDiskOnPeg($(this), $('#peg1'));
    });
}

function resizeDisks() {
    var size = 180;
    var step = 20;
    $(".hanoi_disk").each(function() {
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

    printDebug();
}

function setAcceptCriterea(dragable) {
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
        top-= peg[diskKey].height();
    }

    var left = droppable.offset().left + (droppable.width()-disk.width())/2;

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

function printDebug() {
    $('#debug').remove();
    $('body').append('<div id="debug"/>');


    for (var pegKey in pegs) {
        $('#debug').append(pegKey+':<br/>');

        for(var diskKey in pegs[pegKey]) {
            $('#debug').append(diskKey + ': ' + pegs[pegKey][diskKey].width()+ '<br/>');
        }
    }
}