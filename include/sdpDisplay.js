/**
 * Load and displays SDP data
 * Created by chad on 4/23/16.
 */

$(document).ready(function() {
  //Load & display the data
  $.getJSON(
    "https://raw.githubusercontent.com/webrtcHacks/sdp-anatomy/bootstrap/sdpdata.json",
    function(sdpdata) {
      const data = sdpdata.sdpdata;
      if (data.length > 0) {
        console.log(data.length + " SDP description lines loaded");
        displayData(data);
      } else {
        console.log("SDP data load error");
      }
    }
  );

  const isDesktop = window.innerWidth > 768;
  //Keep the description window in view
  //ToDo: see why I couldn't get bootstrap's affix towork

  const startPos = $("#description").offset().top;

  $(window).scroll(function() {
    if (isDesktop) {
      y = parseInt(startPos - $(document).scrollTop());
      $("#description").css({ top: y < 0 ? 30 : y });
    } else {
      const isHalf = window.innerHeight / 2 < window.scrollY;
      $("#description").css(
        isHalf ? { top: 0, bottom: "" } : { top: "", bottom: 0 }
      );
    }
  });

  $("#description").click(function() {
    $(this).hide();
  });
});

function displayData(data) {
  //Setup our left-side display
  let text = "";
  let currentIndent = 0;
  const hoverData = [];
  const colors = [
    "#980000",
    "#003399",
    "#C92800",
    "#998A00",
    "#353535",
    "#5F00FF",
    "#008299"
  ];

  for (let n in data) {
    const { display, lineNum, indent, lineText, description, section } = data[
      n
    ];

    switch (display) {
      case "line":
        const span = lineText
          .split(" ")
          .map(
            (value, index) =>
              `<span style="color:${colors[index % 7]}">${value}</span>`
          )
          .join(" ");
        text += `<a id="line${lineNum}" class="list-group-item indent${indent}">${span}</a>`;

        //populate our hoverdata
        hoverData.push({
          lineText,
          description,
          section
        });
        break;
      case "continuation":
        text += "</div>";
        currentIndent = indent;
        break;
      case "grouping":
        if (indent > currentIndent) {
          text += '<div class="well">';
        } else if (indent < currentIndent) {
          for (n = currentIndent - indent; n > 0; n--) {
            text += "</div>";
          }
          text += '<div class="well">';
        }

        currentIndent = indent;

        text += `<p class="lead section-label indent${indent}">${section}</p>`;
        break;
    }
  }
  text += "</div>";
  $("#lines").html(text);

  //Show the hover-data
  let i, currentLine, descriptionText, lastHover;
  $(".list-group-item").hover(function() {
    i = $(this).attr("id");
    $(this).addClass("active");
    $(lastHover).removeClass("active");
    lastHover = this;
    currentLine = i.slice(-1 * (i.length - 4)) - 1; //get the line # out of the class name

    descriptionText =
      `<p class='description-label'>${hoverData[currentLine].section}</p>` +
      `<p class='list-group-item description-line'>${hoverData[currentLine].lineText}</p>` +
      `<p class='description-body'>${hoverData[currentLine].description}</p>`;

    $("#description")
      .html(descriptionText)
      .show();
  });
}
