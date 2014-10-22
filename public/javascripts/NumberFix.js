$.validator.methods.range = function (value, element, param) {

    var test;

    //TODO -> fix
    if (element.value.charAt(0) == '£') {
        element.value = element.value.substring(1);
        value = value.substring(1);
        test = true;
    }

    var globalizedValue = value.replace(",", ".");

    var returnValue = this.optional(element) || (globalizedValue >= param[0] && globalizedValue <= param[1]);

    if (test)
        element.value = '£' + element.value;

    return returnValue;
}

$.validator.methods.number = function (value, element) {

    var test;

    //TODO -> fix
    if (element.value.charAt(0) == '£') {
        element.value = element.value.substring(1);
        value = value.substring(1);
        test = true;
    }

    var returnValue = this.optional(element) || /^-?(?:\d+|\d{1,3}(?:[\s\.,]\d{3})+)(?:[\.,]\d+)?$/.test(value);

    if (test)
        element.value = '£' + element.value;

    return returnValue;
}