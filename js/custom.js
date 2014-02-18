/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ajaxComments(url,from,to,start,end){
        var loggedin = false;
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
                    loggedin = stat['LOGGED_IN'];
                    var firstcommset = false;
                    for (var i in jsonData) {
                        if (i != 'status' && !(i.substring(0, 'PAGING'.length) === 'PAGING')) {
                            var row = jsonData[i];

                            output += "<h3><a href='" + row['ID'] + "' class='suggestion'>" + row['TITLE'] + "</a></h3>" +
                                    "<div>" +
//                                    "<input id='" + row['ID'] + "' type='text' value='" + row['CONTENT'] + "' style='display:none;'/>" +
                                    "<p>Created by: " + row['USERNAME'] + "</p>" +
                                    "<p>Ratings: " + row['RATING'] + "</p>" +
                                    "<p>Date Created: " + row['DATE_CREATED'] + "</p>";

                            
//                            var commentstring = "";
//                            try{
//                                var comments = JSON.parse(row['COMMENTS']);
//                                commentstring += "<p>Comments:</p>";
//                                for (var j in comments) {
//    //                                $commentlist[] = array(
//    //                                        'USERNAME'    
//    //                                        'DATE_CREATED'
//    //                                        'CONTENT'     
//    //                                    );
//                                    var comment = comments[j];
//                                    commentstring += "<p class='comment_cont'>" + comment['CONTENT']; + "</p><br/>";
//                                    commentstring += "<span class='comment_uname'> - " + comment['USERNAME'] + "</span>";
//                                    commentstring += "<span class='comment_dateposted'> [" + comment['DATE_CREATED'] + "]</span>";
//                                }
//                            }catch(err){
//                                
//                            } 
                            
//                            var commentstring = "";
                            var commentdiv = "";
                            if(!firstcommset){
                                getComments(row['ID']);
                                commentdiv = "<div id='" + row['ID'] + "' class='commentlist" + row['ID'] + " activecomment'>";
                                firstcommset = true;
                            }else{
                                commentdiv = "<div id='" + row['ID'] + "' class='commentlist" + row['ID'] + "'>";
                            }
                            commentdiv += "</div>";
                            output += commentdiv;
                            //star ratings

                            output += "</div>";
                        }else if(i.substring(0, 'PAGING'.length) === 'PAGING'){
                            var row = jsonData[i];
                            paging += "<span>" + row['VALUE'] + "</span>";
                        }
                    }
                    output += "</div></div>";
                    $('#SearchOutput').html(output);
                    $('#pagingOutput').html(paging); 
                } catch (err) {
                    $('#SearchOutput').html(result);
                }
            }
        }).done(function() {
            if (loggedin) {
                var post = "<p>Yes you can post a comment.</p>";
                $('.activecomment').append(post);   
            } else {
                var post = "<p>No you can't post a comment. <a href='user/?from=" + from + "&to=" + to + "&start=" + start + "&end=" + end + "'>Login</a> first</p>";
                $('.activecomment').append(post);
            }
            $("a.suggestion").on('click',function(event){
                event.preventDefault();
                $('.activecomment').slideUp();
                $('.activecomment').html('');
                $('.activecomment').removeClass('activecomment');
                var id = $(this).attr('href');
                $('#' + id).addClass('activecomment');
                $('#' + id).hide();
                getComments(id);
//                $('#' + id).slideDown();
                //function create comments
            });
        });
    }
    
function getComments(sug_id){
    $.ajax({
        type: "POST",
        url: "findaway/comments/",
        data: {SUG_ID: sug_id},
        success: function (result) {
            var commentstring = "<p>Comments:</p><div id='existingcomments'>";
            try{
                var comments = JSON.parse(result);
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
            }catch(err){
            }
            commentstring +="</div>";
            $('#' + sug_id).append(commentstring);
            $('#' + sug_id).slideDown();

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
    
});