/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


$(function() {
    function split(val) {
        return val.split(/,\s*/);
//        return val;
    }
    function extractLast(term) {
        return split(term).pop();
    }
    $(".search")
            .bind("keydown", function(event) {
        if (event.keyCode === $.ui.keyCode.TAB &&
                $(this).data("ui-autocomplete").menu.active) {
            event.preventDefault();
        }
    })
            .autocomplete({
        source: function(request, response) {
            $.getJSON("search/", {
                term: extractLast(request.term)
            }, response);
        },
        search: function() {
            if (this.value.length < 2) {
                return false;
            }
        },
        focus: function() {
            return false;
        }
    });

    $("#FindRoute").click(function() {
        var from = $("#from").val();
        var to = $("#to").val();

        $.ajax({
            type: "POST",
            url: "findaway/route/",
            data: {from: from, to: to},
            success: function(result) {
                try {
//                    json format
//                    $data[] = array('ID'           
//                                    'USERNAME'     
//                                    'DATE_CREATED' 
//                                    'TITLE,
//                                    'RATING'
//                                    'CONTENT')     
                    var jsonData = JSON.parse(result);
                    var output = "<div id='accordion-resizer' class='ui-widget-content'>" + 
                                 "<div id='accordion'>";
                         
                    var stat = jsonData['status'];
                    var loggedin = stat['LOGGED_IN'];
                    alert(loggedin);
                    for (var i in jsonData) {
                        alert(i);
                        if(i != 'status'){
                        var row = jsonData[i];
                        output += "<h3><a href='www.google.com'>" + row['TITLE'] + "</a></h3>" +
                                  "<div>" +
                                  "<input id='" + row['ID'] + "' type='text' value='" + row['CONTENT'] + "' style='display:none;'/>" +
                                  "<p>Created by: " + row['USERNAME'] + "</p>" + 
                                  "<p>Ratings: " + row['RATING'] + "</p>" +
                                  "<p>Date Created: " + row['DATE_CREATED'] + "</p>" +
                                  "<p>Comments:</p>" + 
                                  row['COMMENTS'];
                                          
                        //star ratings
                        
                        if(loggedin){
                            output += "<p>Yes you can post a comment.</p>";
                        }else{
                            output += "<p>No you can't post a comment. <a href='user/'>Login</a> in first</p>";
                        }
                        output += "</div>";
//                        }else{
//                            var stat = jsonData['status'];
//                            loggedin = stat['LOGGED_IN'];
                        }
//                        alert(row['label']);
                    }
                    output += "</div>" +
                              "</div>";
//                    if(loggedin){
//                    }else{
//                        output += "<p>No you can't post a comment</p>";
//                    }
                    $('#SearchOutput').html(output);
//                    $( "#accordion" ).accordion();
                    $(function() {
                        $( "#accordion" ).accordion({
                            heightStyle: "fill" 
                        });
                    });
                    $(function() {
                        $( "#accordion-resizer" ).resizable({
                            minHeight: 140,
                            minWidth: 200,
                            resize: function() {
                                $( "#accordion" ).accordion( "refresh" );
                            }
                        });
                    });
                } catch (err) {
                    $('#SearchOutput').html(result);
                }
            }
        });
    });
});