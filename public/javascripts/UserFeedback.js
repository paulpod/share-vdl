
$(document).ready
(
    function () 
    {
        $("#linkID").click(function (e) {
            e.preventDefault();
            $("#feedbackPartialView").toggle();
        });

        $('#feedbackPartialView form').submit
        (
            function (eventArgs) {
                if ($(this).valid()) {
                    $('#btnAjax').attr("disabled", true);
                    var formActionDescription = $('#ActionDesctription').val();
                    var formErrorDescription = $('#ErrorDescription').val();
                    var pathName = window.location.pathname;
                    $.ajax({
                        url: '/UserFeedback/UserFeedback',
                        contentType: 'application/html; charset=utf-8',
                        data: { actionDescription: formActionDescription, errorDescription: formErrorDescription, currentPageURL: pathName },
                        type: 'GET',
                        dataType: 'html'
                    })
                    .success(function (result) {
                        $('#feedbackPartialView').html(result);
                    })
                    .error(function (xhr, status) {
                        alert(status);
                    })
                }
                return false;
            }
        );
    }
);