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

// Deletes the option
$("#options").on('click', '.btn_delete', function () {
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

    container.appendChild(getOptionValue(optionTitle));
    container.appendChild(getOptionPrice(optionPrice));
    container.appendChild(getDeleteButton());

    document.getElementById('options').appendChild(container);
}

// Creates Option Input field
function getOptionValue(content) {
    var container = document.createElement('div');
    container.classList.add('col-6');

    var wrapper = document.createElement('div');
    ['form-group', 'text_box'].forEach(item => {
        wrapper.classList.add(item);
    });

    var input = document.createElement('input');
    input.type = "text";
    input.placeholder = "Option";
    input.name = 'pricing[title]';
    input.value = content;

    wrapper.appendChild(input);
    container.appendChild(wrapper);
    return container;
}

// Creates Price Input field
function getOptionPrice(content) {
    var container = document.createElement('div');
    container.classList.add('col-4');

    var wrapper = document.createElement('div');
    ['form-group', 'text_box'].forEach(item => {
        wrapper.classList.add(item);
    });

    var input = document.createElement('input');
    input.type = "number";
    input.placeholder = "Price";
    input.name = 'pricing[price]'
    input.step = "0.01";
    input.value = content;

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

