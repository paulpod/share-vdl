//// letters 
function OnlyLetters(e) {
    var key = String.fromCharCode(e.which);
    switch (e.key)
    {
        case "Insert":
        case "Del":
        case "Home":
        case "End":
        case "PageUp":
        case "PageDown":
        case "Tab":
        case "Enter":
            return true;
    }
    var alphabet = /^[0-9,;:\.!"#\$%&\/\(\)=\?\*\+\-_<>]+$/; //letters and space
    var isLetter = !alphabet.test(key);
    return isLetter;
}

function OnlyLettersEmail(e) {
    var key = String.fromCharCode(e.which);
    switch (e.key) {
        case "Insert":
        case "Del":
        case "Home":
        case "End":
        case "PageUp":
        case "PageDown":
        case "Tab":
        case "Enter":
            return true;
    }
    var alphabet = /[A-Z][a-z][@]$/;
    var isLetter = !alphabet.test(key);
    return isLetter;
}

//// numbers
function OnlyNumbers(e)
{
    switch (e.key)
    {
        case "Insert":
        case "Del":
        case "Home":
        case "End":
        case "PageUp":
        case "PageDown":
        case "Tab":
        case "Enter":
            return true;
    }
    var key = String.fromCharCode(e.which);
    var regNumbers = /^[0-9 \b()\+]+$/;
    var isNumber = regNumbers.test(key);
    return isNumber;
}

/*numbers or letters*/
function AlphaNumeric(e) {

    return OnlyLetters(e) || OnlyNumbers(e);
}

// 2014-02-24 - BEGIN - validation extension which hooks to jQuery Validation Plugin 
//                      and adds styling behaviour to validation error parent controls 
//                      to style validations like in examples from gov.uk
$(document).ready
(
    function ()
    {
        // validate callback for the whole form - add/remove error class for input's parent container
        var validateSingle = function (options)
        {
            var element = options.target;
            $(element).parent('.input').removeClass('validation');
            if ($(element).hasClass('input-validation-error'))
            {
                $(element).parent('.input').addClass('validation');
            }
        };

        // validate callback for a single input - add/remove error class for parent container
        var validateAll = function (form, validations)
        {
            $('.input').removeClass('validation');
            $(validations.errorList).each
            (
                function (index, item)
                {
                    $(item.element).parent('.input').addClass('validation');
                }
            );
        };

        // register validation callbacks to the form and all inputs
        $('#content form').bind
        (
            'invalid-form.validate',
            validateAll
        ).validateDelegate
        (
            ":text, [type='password'], [type='file'], select, textarea, " +
            "[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
            "[type='email'], [type='datetime'], [type='date'], [type='month'], " +
            "[type='week'], [type='time'], [type='datetime-local'], " +
            "[type='range'], [type='color'] ",
            "focusin focusout keyup",
            validateSingle
        ).validateDelegate
        (
            "[type='radio'], [type='checkbox'], select, option",
            "click",
            validateSingle
        );

        // add validation class to all server-rendered validation error messages
        $('.input .field-validation-error').parent('.input').addClass('validation');
    }
);
// 2014-02-24 - END - validation extension...
