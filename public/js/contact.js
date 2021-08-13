$(function () {
  $("#contact-form-box").on("submit", (e) => {
    e.preventDefault();
  });

  $("#contact-form-box").validate({
    rules: {
      name: "required",
      email: {
        required: true,
        email: true,
      },
      subject: "required",
      message: "required",
      recaptcha: "required",
    },
    messages: {
      name: {
        required: "We would love to know who you are",
      },
      email: {
        required:
          "We would love to get in touch with you. Email will not be shared with anyone else.",
        email: "Please enter a valid email",
      },
      subject: {
        required: "We would be grateful if you could summarize your message",
      },
      message: {
        required: "We would love to know what you have to say",
      },
      recaptcha: {
        required: "You are not a robot, are you?"
      }
    },
    submitHandler: async function (form) {
      // Remove any previous errors
      const button = $("button[type='submit']");
      button.text("Sending Message ...");
      button.removeClass("error");

      // Parse form to get contact message
      const formData = $(form).serializeArray();
      const payload = {};
      formData.forEach((x) => {
        payload[x["name"]] = x["value"];
      });

      try {
        const response = await fetch("/contact", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          $("#contact-form-box input, #contact-form-box textarea").fadeTo(
            "slow",
            0.15,
            function () {
              $("#contact-form-box")
                .find(":input")
                .attr("disabled", "disabled");
            }
          );
          button.text("Message Sent Successfully");
          return;
        }
        throw await response.json();
      } catch (err) {
        console.error(err);
        if (err['message']) {
          window.alert(err['message']);
        }
        button.text("Failed to send message");
      }
    },
  });
});
