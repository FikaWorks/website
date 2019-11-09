jQuery(function ($) {
	"use strict";

	/* ========================================================================= */
	/*   Contact Form Validating
	/* ========================================================================= */


	$('#contact-submit').click(function (e) {

		//stop the form from being submitted
		e.preventDefault();

		/* declare the variables, var error is the variable that we use on the end
		to determine if there was an error or not */
		var error = false;
		var name = $('#name').val();
		var email = $('#email').val();
		var subject = $('#subject').val();
		var message = $('#message').val();

		/* in the next section we do the checking by using VARIABLE.length
		where VARIABLE is the variable we are checking (like name, email),
		length is a JavaScript function to get the number of characters.
		And as you can see if the num of characters is 0 we set the error
		variable to true and show the name_error div with the fadeIn effect.
		if it's not 0 then we fadeOut the div( that's if the div is shown and
		the error is fixed it fadesOut.

		The only difference from these checks is the email checking, we have
		email.indexOf('@') which checks if there is @ in the email input field.
		This JavaScript function will return -1 if no occurrence have been found.*/
		if (name.length == 0) {
			var error = true;
			$('#name').css("border-color", "#D8000C");
		} else {
			$('#name').css("border-color", "#666");
		}
		if (email.length == 0 || email.indexOf('@') == '-1') {
			var error = true;
			$('#email').css("border-color", "#D8000C");
		} else {
			$('#email').css("border-color", "#666");
		}
		if (subject.length == 0) {
			var error = true;
			$('#subject').css("border-color", "#D8000C");
		} else {
			$('#subject').css("border-color", "#666");
		}
		if (message.length == 0) {
			var error = true;
			$('#message').css("border-color", "#D8000C");
		} else {
			$('#message').css("border-color", "#666");
		}

		//now when the validation is done we check if the error variable is false (no errors)
		if (error == false) {
			//disable the submit button to avoid spamming
			//and change the button text to Sending...
			$('#contact-submit').attr({
				'disabled': 'false',
				'value': 'Sending...'
			});

			/* using the jquery's post(ajax) function and a lifesaver
			function serialize() which gets all the data from the form
			we submit it to send_email.php */
			$.post("sendmail.php", $("#contact-form").serialize(), function (result) {
				//and after the ajax request ends we check the text returned
				if (result == 'sent') {
					//if the mail is sent remove the submit paragraph
					$('#cf-submit').remove();
					//and show the mail success div with fadeIn
					$('#mail-success').fadeIn(500);
				} else {
					//show the mail failed div
					$('#mail-fail').fadeIn(500);
					//re enable the submit button by removing attribute disabled and change the text back to Send The Message
					$('#contact-submit').removeAttr('disabled').attr('value', 'Send The Message');
				}
			});
		}
	});

});
// End Jquery Function


/* ========================================================================= */
/*	Staticman comments reply
/* ========================================================================= */
function changeValue(elementName, newValue){
	document.getElementsByName(elementName)[0].value=newValue;
};

/* ========================================================================= */
/*	Honeypot
/* ========================================================================= */
$(document).ready(function() {
    $('form').submit(function() {
        if ($('input[type="text"]#e-mail').val().length > 0) {
            $('form').attr('action', '/');
            return false;
        }
    });
});
