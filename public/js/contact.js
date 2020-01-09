

$(function () {
    $('.contact_form_box').submit((e) => {
        e.preventDefault();
    })

    $('.contact_form_box').validate({
        rules: {
            name: "required",
            email: {
                required: true,
                email: true
            },
            subject: "required",
            message: "required"
        },
        messages: {
            name: {
                required: "We would love to know who you are"
            },
            email: {
                required: "We would love to get in touch with you. Email will not be shared with anyone else.",
                email: "Please enter a valid email"
            },
            subject: {
                required: "We would be grateful if you could summarize your message"
            },
            message: {
                required: "We would love to know what you have to say"
            }
        },
        submitHandler: function (form) {
            $(form).ajaxSubmit({
                type: "POST",
                data: $(form).serialize(),
                url: "/contact",
                beforeSend: function () {
                    var button = $("button[type='submit']");
                    button.text("Sending Message");
                    button.removeClass("error");
                },
                success: function () {
                    $('.contact_form_box input, .contact_form_box textarea').fadeTo("slow", 0.15, function () {
                        $('.contact_form_box').find(':input').attr('disabled', 'disabled');
                    });
                    var button = $("button[type='submit']");
                    button.text("Message Sent Successfully");
                },
                error: function () {
                    var button = $("button[type='submit']");
                    button.text("Failed to send message");
                }
            })
        }
    });
});
