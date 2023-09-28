var pixelPicker = document.getElementById("pixelPicker");
var pixelPickerCanvas = document.createElement("canvas");
var pixelPickerCtx = pixelPickerCanvas.getContext("2d");
pixelPickerCanvas.width = 48;
pixelPickerCanvas.height = 48;
pixelPickerCtx.scale(8, 8);

var pickerPixels = [];
var pickerLabels = {};
var pickerGroups = {};
var pickerGroupHeights = {};
var pickerGroupContents = {};

var addPickerGroup = function(id) {
    var group = document.createElement("div");
    group.classList.add("pickerGroup");
    var content = document.createElement("div");
    content.classList.add("pickerGroupContent");
    var img = document.createElement("img");
    img.id = `pickerImg-${id}`;
    img.classList.add("pickerLabelImg");
    img.src = "./img/up.svg";
    img.draggable = false;
    var label = document.createElement("div");
    label.classList.add("pickerLabel");
    label.appendChild(img);
    var labelText = document.createElement("div");
    labelText.classList.add("pickerLabelText");
    labelText.innerHTML += pixels[id].type;
    label.appendChild(labelText);
    label.onclick = function() {
        if (group.style.maxHeight != "0px") {
            group.style.maxHeight = "0px";
            document.getElementById(`pickerImg-${id}`).style.transform = "rotate(180deg)";
        }
        else {
            group.style.maxHeight = `${pickerGroupHeights[pixels[id].type]}px`;
            document.getElementById(`pickerImg-${id}`).style.transform = "rotate(0deg)";
        }
    };
    pixelPicker.appendChild(label);
    group.appendChild(content);
    pixelPicker.appendChild(group);
    pickerLabels[pixels[id].type] = label;
    pickerGroups[pixels[id].type] = group;
    pickerGroupContents[pixels[id].type] = content;
};
var addPickerPixel = function(id, rotation, data) {
    if (brush.inventory[id] == null) {
        brush.inventory[id] = [];
        brush.modifiedInventory[id] = [];
    }
    if (brush.inventory[id][rotation] == null) {
        brush.inventory[id][rotation] = [];
        brush.modifiedInventory[id][rotation] = [];
    }
    brush.inventory[id][rotation][data] = 0;
    brush.modifiedInventory[id][rotation][data] = false;
    var box = document.createElement("div");
    box.id = `picker-${id}-${rotation}-${data}`;
    box.classList.add("pickerPixel");
    box.onclick = function() {
        if (box.disabled) {
            return;
        }
        if (id == PIXELITE_CRYSTAL) {
            var newData = 0;
            if (data == 0) {
                newData = 0;
            }
            else if (data == 1) {
                newData = 2;
            }
            else if (data == 2) {
                newData = 4;
            }
            else if (data == 3) {
                newData = 9;
            }
            else if (data == 4) {
                newData = 24;
            }
            else if (data == 5) {
                newData = 49;
            }
            else if (data == 6) {
                newData = 99;
            }
            else if (data == 7) {
                newData = 199;
            }
            else if (data == 8) {
                newData = 499;
            }
            else if (data == 9) {
                newData = 999;
            }
            brush.setPixel(id, rotation, newData);
        }
        else {
            brush.setPixel(id, rotation, data);
        }
    };
    box.onmouseover = function() {
        if (box.disabled) {
            return;
        }
        if (id == PIXELITE_CRYSTAL) {
            var newData = 0;
            if (data == 0) {
                newData = 0;
            }
            else if (data == 1) {
                newData = 2;
            }
            else if (data == 2) {
                newData = 4;
            }
            else if (data == 3) {
                newData = 9;
            }
            else if (data == 4) {
                newData = 24;
            }
            else if (data == 5) {
                newData = 49;
            }
            else if (data == 6) {
                newData = 99;
            }
            else if (data == 7) {
                newData = 199;
            }
            else if (data == 8) {
                newData = 499;
            }
            else if (data == 9) {
                newData = 999;
            }
            brush.setDescription(PIXELITE_CRYSTAL, 0, newData);
        }
        else {
            brush.setDescription(id, rotation, data);
        }
    };
    box.onmouseout = function() {
        brush.setDescription(brush.pixelId, brush.pixelRotation, brush.pixelData);
    };
    var amount = document.createElement("div");
    amount.id = `pickerAmount-${id}-${rotation}-${data}`;
    amount.classList.add("pickerAmount");
    amount.style.color = pixels[id].amountColor;
    var img = new Image(48, 48);
    img.draggable = false;
    pixels[id].drawPreview(rotation, data, pixelPickerCtx);
    img.src = pixelPickerCanvas.toDataURL("image/png");
    box.appendChild(img);
    box.appendChild(amount);
    pickerGroupContents[pixels[id].type].appendChild(box);
    pickerPixels.push(box);
};

var loadPickerPixels = async function() {
    for (var i = 0; i < pixels.length; i++) {
        if (pixels[i].pickable != false) {
            if (i == FIRE) {
                addPickerPixel(FIRE, 0, 0);
            }
            else {
                if (pickerGroups[pixels[i].type] == null) {
                    addPickerGroup(i);
                }
                for (var j = 0; j < pixels[i].rotateable; j++) {
                    for (var k = 0; k < pixels[i].dataFrames; k++) {
                        addPickerPixel(i, j, k);
                    }
                }
            }
            await new Promise(p => setTimeout(p, 1));
        }
    }
};
window.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        loadPickerPixels();
    }, 1000);
});

var setPickerGroupHeights = function() {
    for (var i in pickerGroups) {
        if (pickerGroups[i].style.display != "none") {
            var expanded = true;
            if (pickerGroups[i].style.maxHeight == "0px") {
                expanded = false;
            }
            pickerGroups[i].style.transition = "none";
            pickerGroups[i].style.maxHeight = "2000px";
            pickerGroupHeights[i] = pickerGroups[i].getBoundingClientRect().height;
            if (expanded) {
                pickerGroups[i].style.maxHeight = `${pickerGroupHeights[i]}px`;
            }
            else {
                pickerGroups[i].style.maxHeight = "0px";
                console.log(i)
            }
            pickerGroups[i].offsetHeight;
            pickerGroups[i].style.transition = "200ms ease-out max-height";
        }
    }
}