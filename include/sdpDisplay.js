/**
 * Load and displays SDP data
 * Created by chad on 4/23/16.
 */

    //Load & display the data
$.getJSON("//raw.githubusercontent.com/webrtcHacks/sdp-anatomy/bootstrap/sdpdata.json", function (sdpdata) {
    var data = sdpdata.sdpdata;
    if (sdpdata.sdpdata.length > 0) {
        console.log(sdpdata.sdpdata.length + " SDP description lines loaded");
        displayData(data)
    }
    else {
        console.log("SDP data load error");
    }
});

function displayData(data) {
    //Setup our left-side display
    var text = "";
    var currentIndent = 0;
    var hoverData = [];

    for (var n in data) {

        var d = data[n];

        //TODO: change this to a switch case?
        if (d.display == "line") {
            text += '<a ' + 'id="line' + d.lineNum + '" class="list-group-item indent' + d.indent + '">' + d.lineText + '</a>';

            //populate our hoverdata
            //TODO: do a lookup on the data object so I don't need to replicate this
            var lineData = {
                "lineText": d.lineText,
                "description": d.description,
                "section": d.section
            };

            hoverData.push(lineData);
        }
        else if (d.display == "continuation") {
            text += '</div>';
            currentIndent = d.indent;
        }
        else if (d.display == "grouping") {


            if (d.indent > currentIndent) {
                text += '<div class="well">';
            }
            else if (d.indent < currentIndent) {
                for (n = currentIndent - d.indent; n > 0; n--) {
                    text += '</div>';
                }
                text += '<div class="well">';
            }

            currentIndent = d.indent;

            text += '<p ' + 'class="lead section-label indent' + d.indent + '">' + d.section + '</p>';
        }

    }
    text += '</div>';
    $("#lines").html(text);


    //Show the hover-data
    var i, currentLine, descriptionText, lastHover;
    $(".list-group-item").hover(function () {
        i = $(this).attr("id");
        $(this).addClass("active");
        $(lastHover).removeClass("active");
        lastHover = this;
        currentLine = i.slice(-1 * (i.length - 4)) - 1;  //get the line # out of the class name


        descriptionText = "<p class='description-label'>" + hoverData[currentLine].section + "</p>" +
            "<p class='list-group-item description-line'>" + hoverData[currentLine].lineText + "</p>" +
            "<p class='description-body'>" + hoverData[currentLine].description + "</p>";

        $('#description').html(descriptionText);
    });
}