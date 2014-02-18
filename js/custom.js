/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
 function ajaxComments(url,from,to,start,end){
        $.ajax({
            type: "POST",
            url: url,
            data: {from: from, to: to,start: start,end: end},
            success: function(result) {
                try {
//                    json format
//                    $data[] = array('ID'           
//                                    'USERNAME'     
//                                    'DATE_CREATED' 
//                                    'TITLE,
//                                    'RATING'
//                                    'CONTENT'
//                                    'COMMENTS')     
                    var jsonData = JSON.parse(result);
                    var paging = "";
                    var output = "<div id='accordion-resizer' class='ui-widget-content'>" +
                            "<div id='accordion'>";

                    var stat = jsonData['status'];
                    var loggedin = stat['LOGGED_IN'];
                    for (var i in jsonData) {
                        if (i != 'status' && !(i.substring(0, 'PAGING'.length) === 'PAGING')) {
                            var row = jsonData[i];

                            output += "<h3><a href='www.google.com'>" + row['TITLE'] + "</a></h3>" +
                                    "<div>" +
                                    "<input id='" + row['ID'] + "' type='text' value='" + row['CONTENT'] + "' style='display:none;'/>" +
                                    "<p>Created by: " + row['USERNAME'] + "</p>" +
                                    "<p>Ratings: " + row['RATING'] + "</p>" +
                                    "<p>Date Created: " + row['DATE_CREATED'] + "</p>" +
                                    "<p>Comments:</p>";

                            var comments = JSON.parse(row['COMMENTS']);
                            var commentstring = "<div class='commentlist'>";
                            for (var j in comments) {
//                                $commentlist[] = array(
//                                        'USERNAME'    
//                                        'DATE_CREATED'
//                                        'CONTENT'     
//                                    );
                                var comment = comments[j];
                                commentstring += "<p class='comment_cont'>" + comment['CONTENT']; + "</p><br/>";
                                commentstring += "<span class='comment_uname'> - " + comment['USERNAME'] + "</span>";
                                commentstring += "<span class='comment_dateposted'> [" + comment['DATE_CREATED'] + "]</span>";
                            }
                            commentstring += "</div>";
                            output += commentstring;
                            //star ratings

                            if (loggedin) {
                                output += "<p>Yes you can post a comment.</p>";
                            } else {
                                output += "<p>No you can't post a comment. <a href='user/'>Login</a> in first</p>";
                            }
                            output += "</div>";
                        }else if(i.substring(0, 'PAGING'.length) === 'PAGING'){
//                            alert(i);
                            var row = jsonData[i];
                            paging += "<span>" + row['VALUE'] + "</span>";
                        }
                    }
                    output += "</div></div>";
                    $('#SearchOutput').html(output);
                    $('#pagingOutput').html(paging);
                    $(function() {
                        $("#accordion").accordion({
                            heightStyle: "fill"
                        });
                        $( "#commentlist1" ).selectable();
                    });
                    $(function() {
                        $("#accordion-resizer").resizable({
                            minHeight: 140,
                            minWidth: 200,
                            resize: function() {
                                $("#accordion").accordion("refresh");
                            }
                        });
                    });
                } catch (err) {
                    $('#SearchOutput').html(result);
                }
            }
        });
    }

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

        ajaxComments("findaway/route/",from,to,0,4);
//        ajaxPaging(from,to);
    });
    
    $("span").on('click',function(event){
        alert('here');
        event.preventDefault();
//        var url = $(this).attr('href');
//        alert(url + "route/");
    });
    
//    function ajaxPaging(from,to){
//        $.ajax({
//            type: "GET",
//            url: "findaway/paging/",
//            data: {from: from,to: to},
//            success: function(result){
//                
//            }
//        });
//    }
});