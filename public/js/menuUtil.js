$('#categories').on('change', function () {
    var selectedItem = $('#categories option:selected').text();
    if (selectedItem.toUpperCase().includes("NEW")) {
        $("#newCategory").addClass("d-block").prop('required', true);

    } else {
        $("#newCategory").removeClass("d-block").prop('required', false);
    }
});

$("#add_option").on('click', function () {
    addNewOptionField();
});

$("#options").on('click', '.btn_delete', function () {
    $(this).parent().parent().fadeOut(200, function () {
        $(this).remove();
    });
});

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

