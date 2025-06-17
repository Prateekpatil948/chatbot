var curQuestion = "";
var chatstart = false;
var messageDiv;
var curDiv;
var newDiv = document.createElement("span");
newDiv.textContent = "";
newDiv.id = "myNewDiv";
var curUser;

function removeherosection() {
  var element = document.getElementById("herosection");
  if (chatstart == true) {
    element.style.display = "none";
  }
}

function removetext() {
  var textBox = document.getElementById("chat_input");
  textBox.value = textBox.value.replace(/[\n\r]/g, ""); // Remove all newline characters (both \n and \r)
  textBox.value = ""; // Clear the textarea value
  textBox.placeholder = "Message Chatbot"; // Set the placeholder text
  document.getElementById("chat_input").disabled = false;
  document.getElementById('toggleRecording').disabled = false;
}

function add_question(question) {
  messageDiv =
    '<div class="form-control mx-auto rounded-4 my-3" placeholder="Message Chatbot" id="newchat" style="width: 80%;border: none;">' +
    '<div class="container-fluid p-0 m-0 fw-bold" style="overflow: hidden; word-wrap: break-word;width: 100%;">' +
    '<strong class="p-0 m-0 fw-bold">' +
    question +
    "?</strong><br/><div class='cursor' id='cursor'></div>";
  $("#load_chats").append(messageDiv);
}

function add_message(question, answer) {
  var elementToDelete = document.getElementById("cursor");
  elementToDelete.remove();
  console.log("Adding message:", answer);
  var messageDiv = $('<div class="newmessage"></div>');
  $("#newchat").append(messageDiv);
  curDiv = document.getElementById("newchat");
  var currentIndex = 0;
  var typingSpeed = 1;
  function displayContent() {
    if (currentIndex < answer.length) {
      messageDiv.append(answer[currentIndex]);

      currentIndex++;
      setTimeout(displayContent, typingSpeed);

      messageDiv.append(newDiv);
      
      const dobj = document.querySelector("#myNewDiv");
      dobj.scrollIntoView({ behavior: "smooth" });
    } else {
      console.log("Content completely displayed, executing removetext");
      // var elementToDelete = document.getElementById("myNewDiv");
      // elementToDelete.remove();
      messageDiv.append(
        "<div class='d-flex'><div class='me-auto'></div><div><button onclick='TextToSppech(this)' class='btn fa fa-volume-up'></button></div></div>"
      );
      load_chathistory();
      removetext();
      curDiv.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }
  displayContent();
}

function TextToSppech(button) {
  var text = button.parentNode.parentNode.parentNode.textContent.trim();
  var utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

function load_chathistory() {
  $.ajax({
    url: "/load_chathistory",
    type: "POST",
    contentType: "application/json",
    success: function (response) {
      // console.log("Response from load_chathistory server:", JSON.stringify(response));
      var parsedData = JSON.parse(JSON.stringify(response));
      var numberOfItems = Object.keys(parsedData).length;
      // console.log("Number of Chat History:", numberOfItems);
      var container = document.getElementById("chatHistoryContainer");
      container.innerHTML = "";

      var numChatHistories = numberOfItems;

      for (var i = 0; i < numChatHistories; i++) {
        var item = parsedData[i];
        // console.log(item.message + ": " + item.reply);
        var anchor = document.createElement("a");
        anchor.setAttribute("href", "#");
        anchor.setAttribute(
          "class",
          "list-group-item list-group-item-action py-3 lh-sm"
        );
        anchor.setAttribute(
          "style",
          "color: white; background-color: #070f2b !important; border: none;"
        );
        var div = document.createElement("div");
        div.setAttribute("class", "col-10 mb-1 small px-1");
        div.textContent = item.message + "?";
        var parentWidth = container.offsetWidth;
        div.style.whiteSpace = "nowrap";
        div.style.overflow = "hidden";
        div.style.textOverflow = "ellipsis";
        div.style.maxWidth = parentWidth + "px";

        anchor.appendChild(div);

        container.appendChild(anchor);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
      // Handle error
    },
  });
}

function texttochat(text) {
  if (text != "") {
    chatstart = true;
    removeherosection();
    var message = text;
    document.getElementById("chat_input").disabled = true;
    document.getElementById('toggleRecording').disabled = true;
    curQuestion = message;
    console.log(message);
    add_question(curQuestion);
    $.ajax({
      url: "/get_response",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ user_input: message }),
      success: function (response) {
        console.log("Response from server:", JSON.stringify(response));
        add_message(curQuestion, response.response);
        var element = document.getElementById("newchat");
        // Change the ID to a new one
        element.setAttribute("id", "oldchat");
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
        // Handle error
      },
    });
  }
}

$(function () {
  $("#chat_input").on("keypress", function (event) {
    if (event.which === 13 && $(this).val() != "") {
      chatstart = true;
      removeherosection();
      var message = $(this).val();
      $(this).val("");
      document.getElementById("chat_input").disabled = true;
      document.getElementById('toggleRecording').disabled = true;

      curQuestion = message;
      console.log(message);
      add_question(curQuestion);
      $.ajax({
        url: "/get_response",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ user_input: message }),
        success: function (response) {
          console.log("Response from server:", JSON.stringify(response));
          add_message(curQuestion, response.response);
          var element = document.getElementById("newchat");
          // Change the ID to a new one
          element.setAttribute("id", "oldchat");
        },
        error: function (xhr, status, error) {
          console.error("Error:", error);
          // Handle error
        },
      });
    }
  });
});

function logout() {
  event.preventDefault(); // Prevent the default form submission behavior
  console.log("Entered logout");
  $.ajax({
    type: "POST",
    url: "/logout",
    data: {},
    success: function (data) {
      console.log(data);
      if (data.success) {
        console.log(data.message);
        console.log(data.redirect);
        // Redirect to the specified URL
        localStorage.setItem("cur_user", null);
        window.location.href = data.redirect;
      } else {
        // Handle unsuccessful login
        console.log(data.message); // Or display the error message in a more user-friendly way
      }
    },
    error: function (xhr, status, error) {
      // Handle AJAX errors here
      console.error("Error:", error);
      // Show error message to the user
    },
  });
}

function reset_password() {
  console.log("CurUSer : " + curUser);
  var password = document.getElementById("new_pwd_request").value;
  console.log(password);
  $.ajax({
    type: "POST",
    url: "/set_password",
    data: { user: curUser, password: password },
    success: function (data) {
      console.log(data);
      if (data.success == true) {
        $("#pwd_reset_request").modal("hide");
      }
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    },
  });
}

function reload() {
  location.reload();
}

function send_history() {
  $.ajax({
    type: "POST",
    url: "/send_history",
    data: {},
    success: function (data) {
      console.log(data.success);
      console.log(data.message);
      // alert modal
      if(data.flag==0){
        $("#chathistory_email_success_modal").modal("show");
      }
      else{
        $("#chathistory_email_error_modal").modal("show");
      }
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    },
  });
}

let mediaRecorder;
let recordedChunks = [];
let isRecording = false;
let stream; // Define the stream variable here

async function toggleRecording() {
  console.log("toggleRecording() called");
  if (!isRecording) {
    document.getElementById("chat_input").disabled = true;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = function (event) {
        recordedChunks.push(event.data);
      };
      mediaRecorder.start();
      $("#toggleRecording").css("background-color", "red");

      isRecording = true;
    } catch (err) {
      console.error("Error accessing microphone", err);
    }
  } else {
    $("#toggleRecording").css("background-color", "rgba(0, 0, 0, 0.553)");
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      await new Promise((resolve) => {
        mediaRecorder.onstop = resolve;
      });
      const blob = new Blob(recordedChunks, { type: "audio/webm" });
      await sendAudioToBackend(blob);
    }
  }
}

async function sendAudioToBackend(audioBlob) {
  console.log("Sending audio to the server...");
  const formData = new FormData();
  formData.append("audio", audioBlob, "recorded_audio.webm");

  try {
    const response = await $.ajax({
      url: "/transcribe",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (data) {
        console.log("Success : ", data);
        texttochat(data.transcription);
        removetext();
        mediaRecorder = null;
        recordedChunks = [];
        isRecording = false;
        // Stop the media stream to release the microphone
        if (stream) {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
        }
      },
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

function boxtochat(element) {
  // Get the text content of the clicked element
  var text = element.textContent.trim();

  // Output the text to console or do whatever you want with it
  console.log(text);
  texttochat(text);
}


function prompttotext(element){
  $("#promptmodal").modal("hide");
  var text = element.textContent.trim();

  // Output the text to console or do whatever you want with it
  console.log(text);
  texttochat(text);
}

function openpromptmodal() {
  $.ajax({
  url: '/get_prompt_questions',
  type: 'GET',
  success: function(response) {
      // Update the webpage with the received questions
      var questions = response.questions;
      var questionsList = $('#questionsList');
      questionsList.empty();
      $.each(questions, function(index, question) {
          questionsList.append('<div class="card mx-3 mb-3 p-3 border-1 shadow-sm promptbox" style="          background-color: #fff;transition: all 0.3s ease-in-out;cursor: pointer;width: 95% !important;"onclick="prompttotext(this)"><div class="card-body p-0 m-0"><p class="card-text p-0 m-0" style="font-size: 18px; color: #333">'+question+'</p></div></div>');
          
      });
      $("#promptmodal").modal("show");
  },
  error: function(xhr, status, error) {
      console.error('Error:', error);
  }
});
  
}

$(document).ready(function () {
  $.ajax({
    type: "POST",
    url: "/get_user",
    data: {},
    success: function (data) {
      console.log(data);
      if (data.success == true) {
        if (data.pwd_reset == 1) {
          curUser = data.user;
          $("#pwd_reset_request").modal("show");
        }
        curUser = data.user;
        var name = data.user_name;
        var setname = document.getElementById("user_name");

        setname.textContent = name;

        var setfirstletter = document.getElementById("first_letter");

        // Set the text content of the span
        setfirstletter.textContent = name[0].toUpperCase();
      } else {
        console.log("Session is not valid");
        window.location.href = "/";
      }
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    },
  });
  console.log(JSON.stringify(curUser));

  load_chathistory();
});