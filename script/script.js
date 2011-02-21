/*
 * TODO:
 * - Pass ids to functions instead of pegs and discs. (not sure)
 * - Change size, margins and position of #hanoi according to the ammount of .hanoi-disks
 **/
var pegs = {};
var defaultPeg = '';
var lastGameCompletePegId = defaultPeg;

$(function() {
    $('#hanoi').css('visibility', 'visible');

    // Define dragables
    $('.hanoi_disk').draggable({
        revert: 'invalid'
    });

    initPegs();
    resizeDisks();
    initDisks();

    $('.hanoi_peg').droppable({
        drop: processDiskDrop,
        accept: isAcceptable,
        tolerance: 'touch'
    });

});

function initPegs() {
    $('.hanoi_peg').each(function() {
        var pegId = $(this).attr('id');
        pegs[pegId] = {};
    });
}

function initDisks() {
    var i = 2;
    var numberOfPegs = $('.hanoi_peg').size();

    $($('.hanoi_disk').get().reverse()).each(function() {
        var disk = $(this);
        var diskId= disk.attr('id');
        var pegId = 'peg'+i;

        pegs[pegId][diskId] = disk;
        placeDiskOnPeg(disk, $('#'+pegId));

        i++;
        i= i%numberOfPegs;
    });
}

function resizeDisks() {
    var size = 290;
    var step = 25;
    $($('.hanoi_disk').get().reverse()).each(function() {
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
    disk.offset(findNewOffset(disk,droppable));
}

function findNewOffset(disk, droppable) {
    var pegId = droppable.attr('id');
    var peg = pegs[pegId];
    var pegBottom = droppable.offset().top + droppable.height();

    var top = pegBottom;

    for (var diskKey in peg) {
        top-= peg[diskKey].outerHeight();
    }

    var left = droppable.offset().left + (droppable.width()-disk.outerWidth())/2;

    return {top:top, left:left};
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
    var candidate = null;

    for (var pegKey in pegs) {
        var peg = pegs[pegKey];

        if(isPegEmpty(peg)) continue;

        if (candidate == null) {
            candidate = pegKey;
        } else {
            return;
        }
    }

    if (candidate != lastGameCompletePegId) {
        lastGameCompletePegId = candidate;
        alert('Yay, You made it!');
    }
}

function isPegEmpty(peg) {
    var size = 0;

    for (var key in peg) {
        if (peg.hasOwnProperty(key)) size++;
    }
    
    return size == 0;
}