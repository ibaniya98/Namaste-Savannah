// Shows/hides input field when new Category is selected
$('#categories').on('change', function () {
    var selectedItem = $('#categories option:selected').val();
    if (selectedItem.toUpperCase() == "NEW") {
        $("#newCategory").addClass("d-block").prop('required', true);
    } else {
        $("#newCategory").removeClass("d-block").prop('required', false);
    }
});

// Adds new option field when user selects add option button
$("#add_option").on('click', function () {
    addNewOptionField();
});

// Adds new modifier field when user selects add modifier button
$("#add_modifier").on('click', function () {
    addNewModifierField();
});

// Deletes the option
$("#options").on('click', '.btn_delete', function () {
    $(this).parent().parent().fadeOut(200, function () {
        $(this).remove();
    });
});

// Deletes the modifier
$("#modifiers").on('click', '.btn_delete', function () {
    $(this).parent().parent().fadeOut(200, function () {
        $(this).remove();
    });
});

// Creates option field with specified params
function addNewOptionField(optionTitle="", optionPrice=null) {
    var container = document.createElement('li');
    ['row', 'col-12'].forEach(item => {
        container.classList.add(item);
    });

    const optionTitleField = getTitleField(optionTitle, "Option", "pricing[title]");
    const optionPriceField = getPriceInput("Price", "pricing[price]", optionPrice);
    
    container.appendChild(optionTitleField);
    container.appendChild(optionPriceField);
    container.appendChild(getDeleteButton());

    document.getElementById('options').appendChild(container);
}

// Creates modifier field with specified params
function addNewModifierField(modifierTitle="", optionPrice=null) {
    var container = document.createElement('li');
    ['row', 'col-12'].forEach(item => {
        container.classList.add(item);
    });

    const modifierTitleField = getTitleField(modifierTitle, "Modifier", "modifiers[values][title]");
    const modifierPriceField = getPriceInput("Price", "modifiers[values][price]", optionPrice);

    container.appendChild(modifierTitleField);
    container.appendChild(modifierPriceField);
    container.appendChild(getDeleteButton());

    document.getElementById('modifiers').appendChild(container);
}

// Get input field for title
function getTitleField(content, placeHolder, inputName, required=true) {
    var container = document.createElement('div');
    container.classList.add('col-6');

    var wrapper = document.createElement('div');
    ['form-group', 'text_box'].forEach(item => {
        wrapper.classList.add(item);
    });

    var input = document.createElement('input');
    input.type = "text";
    input.placeholder = placeHolder;
    input.name = inputName;
    input.value = content;
    input.required = required;

    wrapper.appendChild(input);
    container.appendChild(wrapper);
    return container;
}

// Creates Price Input field
function getPriceInput(placeholder, inputName, inputValue, required=true) {
    var container = document.createElement('div');
    container.classList.add('col-4');

    var wrapper = document.createElement('div');
    ['form-group', 'text_box'].forEach(item => {
        wrapper.classList.add(item);
    });

    var input = document.createElement('input');
    input.type = "number";
    input.placeholder = placeholder;
    input.name = inputName
    input.step = "0.01";
    input.value = inputValue;
    input.required = required;

    wrapper.appendChild(input);
    container.appendChild(wrapper);
    return container;
}

// Creates Delete button
function getDeleteButton() {
    var container = document.createElement('div');
    container.classList.add('col-1');

    var deleteBtn = document.createElement('button');
    deleteBtn.type = "button";
    deleteBtn.classList.add('btn_delete');
    deleteBtn.textContent = "X";

    container.appendChild(deleteBtn);
    return container;
}

