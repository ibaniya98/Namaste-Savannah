// Update form's action for deleting the partner
$(".ti-trash").on('click', function () {
    var partnerId = $(this).parent().data('id');
    var deleteLink = "/partner/" + partnerId + '?_method=DELETE';

    var container = $(this).parent().parent().parent();
    var data = parseDataForForm(container);

    $("#delete-modal-form").attr('action', deleteLink);
    $("#partner-name").text(data.name);
});

// Update the form modal when creating a new partner
$("#add_option").on('click', function () {
    $("#modal-title").text("Add New Partner");
    $("#btn_partner").text("Add Partner");
    $("#partner-modal").attr('action', '/partner/new');
    populateDetailsModal("", "", "", "", false, false);
});

// Populates the modal form with the given value
function populateDetailsModal(name, imageUrl, orderUrl, items, isPopular, inHomepage) {
    $("#name").val(name);
    $("#imageUrl").val(imageUrl);
    $("#orderLink").val(orderUrl);
    $("#items").val(items);
    $("#popular").prop('checked', isPopular);
    $("#homepage").prop('checked', inHomepage);
}

// Retrieve data from the dom and populate the modal for updating the partner
$('.ti-pencil').on('click', function () {
    var container = $(this).parent().parent().parent();
    var parsedData = parseDataForForm(container);

    console.log(parsedData);

    populateDetailsModal(parsedData.name, parsedData.imageUrl,
        parsedData.orderUrl, parsedData.items, parsedData.isPopular, parsedData.showInHomepage);
    $("#modal-title").text("Update Partner");
    $("#btn_partner").text("Update");

    // Update the form's action
    var partnerId = $(this).parent().data('id');
    var editLink = '/partner/' + partnerId + '?_method=PUT';
    $("#partner-modal").attr('action', editLink);
});

// Parses the DOM and gets necessary data
function parseDataForForm(container) {
    var returnData = {};

    returnData.isPopular = false;
    returnData.showInHomepage = false;

    container.children().each(function () {
        var currentTag = this.tagName;
        if (currentTag == "IMG") {
            returnData.name = this.alt;
            returnData.imageUrl = this.src;
        } else if (currentTag == "DIV" && this.classList.contains("tag_label")) {
            returnData.isPopular = true;
        } else if (currentTag == "UL") {
            var popularItems = [];
            [...this.children].forEach(child => {
                popularItems.push(child.textContent);
            });
            returnData.items = popularItems.join(", ")
        } else if (currentTag == "A") {
            returnData.orderUrl = this.href;
        } else if (this.classList.contains("homepage-visibility")) {
            returnData.showInHomepage = true;
        }
    });

    return returnData;
}