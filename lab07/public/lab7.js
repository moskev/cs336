
//Author: Moses Mangunrahardja
//Lab 7 CS 336
//Jquery and Ajax

//Script stars here
    $( document ).ready(function() {
 
    $( "a" ).click(function( event ) {
 
        alert( "As you can see, the link no longer took you to jquery.com" );
        event.preventDefault();
        $( this ).hide( "slow" );

 
    });

    $( "a" ).addClass( "test" );
  

	$("#btn1").click(function(){
         $('#data').remove();
        let text = $("<p id='data'> </p>").text('no data yet... ');
        $("p").append(text);
// Using the core $.ajax() method
        $.ajax({
            // The URL for the request
            url: '/fetch',

            // The data to send (will be converted to a query string)
            data: {
                name: 'lab7!'
            }
            // Whether this is a POST or GET request
            type: 'GET',
        })
// Code to run if the request succeeds (is done);
  // The response is passed to the function
        .done(function(result) {
            console.log('AJAX request succedded...');
            $('#data').text(result.content);
        })
// Code to run if the request fails; the raw request and
  // status codes are passed to the function
        .fail(function(xhr, status, errorThrown) {
            alert( "The request is complete!" );
        })

    });

}); 