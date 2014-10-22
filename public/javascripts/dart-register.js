//EMPTY ADDRESS FIELDS
function emptyAddressFields() {
    $('#MailingAddress_PostalCode').val('');
    $('#AddressField').val('');
    $('#AddressField1').val('');
    $('#CityField').val('');
    $('#AddressDropDown').empty();
}

//SET ADDRESS FIELDS READ ONLY ATTRIBUTE
function setAddressFieldsReadOnlyStates(isReadOnly) {
    //$('#name').attr("readonly", isReadOnly);     -- This object is not in the page
    $('#MailingAddress_PostalCode').attr("readonly", isReadOnly);
    $('#AddressField').attr("readonly", isReadOnly);
    $('#AddressField1').attr("readonly", isReadOnly);
    $('#CityField').attr("readonly", isReadOnly);
}

//VERIFY ADDRESS FIELDS AGAINST ADDRESSDROPDOWN
function verifyAddress(address) {
    if (address.Text == 'Select one from list' || //Skips the First item from the AddressDropDown List
        address.Text == 'Not in the list' ||      //Skips the last item from the AddressDropDown List
        $.trim(address.Text.trim()) == 'Address not in the list') { //Skips if no address was found and AddressDropDown List defaults to empty
        //Added Trim since there is a whitespace in front of 'Address .. received from the server
        return false;
    }


    //Trim is added to all the text values incase there is whitespace in the front 
    //and back of text given and received from the Db
    var addr = $.trim($('#AddressField').val().toLowerCase());
    var addr1 = $.trim($('#AddressField1').val().toLowerCase());
    var city = $.trim($('#CityField').val().toLowerCase());

    var strSplit = address.Text.split(",");
    var compareAddr = $.trim(strSplit[0].toLowerCase());
    var compareTown = '';
    var compareCity = '';

    //IF Statement if there is a Town name in the split
    if (strSplit.length > 2) {
        compareTown = $.trim(strSplit[1].toLowerCase());
        compareCity = $.trim(strSplit[2].toLowerCase());
        //Validate Address
        if (addr == compareAddr &&
            addr1 == compareTown &&
            city == compareCity) {
            return true;
        }
    }
    else {
        compareCity = $.trim(strSplit[1].toLowerCase());
        //Validate Address
        if (addr == compareAddr &&
            city == compareCity) {
            return true;
        }
    }
    return false;
}

$(document).ready(function () {
    // select country according to optgroup
    $("#CountryCodeField optgroup[value='" + $("#OptGroup").val() + "'] option[value='" + $("#OptValue").val() + "']").attr('selected', true);

    $('#loadingItem').hide();

    

    //SALUTATION:
    //toggle title text, move dropdown left depending on selection
    if ($('#Salutation').val() == 7) {
        $('#SalutationText').show();
        $('#Salutation').css({ "margin-left": "-5em" });
    }
    else {
        $('#SalutationText').hide();
        $('#SalutationText').val($('#Salutation option:selected').text());
        $('#Salutation').css({ "margin-left": "0em" });
    }

    //toggle title text, move dropdown left depending on selection
    $('#Salutation').change(function () {
        var selectedID = $(this).val();

        if (selectedID == 7) {
            $('#SalutationText').show();
            $('#SalutationText').val(null);
            $(this).css({ "margin-left": "-5em" });
        }
        else {
            $('#SalutationText').hide();
            $('#SalutationText').val($('#Salutation option:selected').text());
            $(this).css({ "margin-left": "0em" });
        }
    });

    //ADDRESS FIELDS:
    //since by default UK is chosen coutry, hide address drop down and addess fields
    $('#AddressDropDown').hide();



    //COUNTRY SELECTION:
    //adjust address fields on postback
    if ($('#CountryCodeField').val() == 'GB' || '#CountryCodeField'.val() == 'UK') {
        //show lookup button
        $("#FindAddressButton").show();
        $("#MailingAddress").hide();
        $('#btnNext').prop("disabled", true);
    }
    else {
        //hide lookup button
        $("#FindAddressButton").hide();
        $("#MailingAddress").show();
        $('#btnNext').prop("disabled", false);
    }

    //Country DropDown List Selection
    $('#CountryCodeField').change(function () {
        var selectedCountry = $(this).val();

        //hide this one by default
        $('#AddressDropDown').hide();
        //empty address text boxes
        emptyAddressFields();
        //remove any eventual read only states from addess fields
        setAddressFieldsReadOnlyStates(false);

        //if coutry is UK aka GB
        if (selectedCountry === 'GB' || selectedCountry === 'UK') {
            //show lookup button
            $("#FindAddressButton").show();
            $("#MailingAddress").hide();
            $('#btnNext').prop("disabled", true);
        }
        else {
            //hide lookup button
            $("#FindAddressButton").hide();
            $("#MailingAddress").show();
            $('#btnNext').prop("disabled", false);
        }

        $("#OptGroup").val($('#CountryCodeField :selected').parent().attr('value'));
        $("#OptValue").val($('#CountryCodeField :selected').attr('value'));
    });


    //when user hits "Find address" button, all fun starts here
    $('#FindAddressButton').click(function () {
        //if post code is emtpy no sense doing lookup and show address drop down
        if ($('#MailingAddress_PostalCode').val() == '') {
            $('#AddressDropDown').hide();
            //do the cleaning too
            emptyAddressFields();
            setAddressFieldsReadOnlyStates(false);
            return false;
        }

        //change post code field content to upper case
        $('#MailingAddress_PostalCode').val($('#MailingAddress_PostalCode').val().toUpperCase());

        //store the vcalue of post code field in variable to make things simpler
        var postCode = $('#MailingAddress_PostalCode').val();

        /////////////////////////please wait dialog
        $("#loadingItem").dialog({
            width: 'auto',
            modal: true,
            open: function (event, ui) { $('.ui-widget-overlay'); }
        });
        $(".ui-dialog-titlebar").hide();
        /////////////////////////please wait dialog end

        var indexSelected = '';
        //Call the method to get address for this postal code via asznc call to this controller method
        $.getJSON('/Registration/GetAddressLists', { input: postCode }, function (aLists) {
            var addressLists = $('#AddressDropDown');

            addressLists.empty();

            $.each(aLists, function (index, aList) {
                //Verification to check if Address entered is already in the list
                if (verifyAddress(aList)) {
                    $('#btnNext').prop("disabled", false);
                    indexSelected = aList.Value;
                }
                addressLists.append(
                    $('<option/>')
                        .attr('value', aList.Value)
                        .text(aList.Text)
                );
            });

            addressLists.show();
            addressLists.focus;
        }).done(function () {                               /////////////////////////please wait dialog
            $('#loadingItem').dialog('close');
            if (indexSelected != '' || indexSelected != '0') {
                $($('#AddressDropDown').children('[value=' + indexSelected + ']')[0]).prop('selected', 'selected');
            }
        });

        return false;
    });

    //Changes in selection of 'AddressDropDown' List
    $('#AddressDropDown').change(function () {
        var address = $(this).val();
        $('#MailingAddress').show();

        //Changes the text input of the address to what gets selected from the 'AddressDropDown' List
        if (address != "0" && $('#AddressDropDown option:selected').text() != "Not in the list") {
            var addr = $('#AddressField');
            var townname = $('#AddressField1');
            var city = $('#CityField');

            var strSplit = $('#AddressDropDown option:selected').text().split(",");

            addr.val($.trim(strSplit[0]));

            //If there is a Town name in the split
            if (strSplit.length > 2) {
                townname.val($.trim(strSplit[1]));
                city.val($.trim(strSplit[2]));
            }
            else {
                city.val($.trim(strSplit[1]));
                townname.val('');
            }

            //Set Address TextFields to READ ONLY and enable NEXT button
            setAddressFieldsReadOnlyStates(true);
            $('#btnNext').prop("disabled", false);
        }

        //Correct MailingAddress_PostalCode has been verified but the address is still not in the list
        if ($('#AddressDropDown option:selected').text() == "Not in the list") {
            $('#AddressField').val('');
            $('#AddressField1').val('');
            $('#CityField').val('');
            $('#btnNext').prop("disabled", false);
            setAddressFieldsReadOnlyStates(false);
        }
    });
});//END of document ready event handler !!
