const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
var verify_otp = "";

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

function sendotp() {
  var divToRemove = document.getElementById("invalid_email_reset");
  if (divToRemove) {
    divToRemove.remove();
  }
  var email = document.getElementById("email_for_reset").value;
  console.log(email);
  $.ajax({
    type: "POST",
    url: "/sendotp",
    data: {
      email: email,
    },
    success: function (data) {
      if (data.success) {
        $("#password_reset_modal").modal("hide");
        $("#password_reset_success_modal").modal("show");
        console.log(data.message);
      } else {
        if(data.flag==2){
          console.log(data.message);
        var newDiv = document.createElement("div");
        newDiv.classList.add("alert", "alert-danger", "mt-3");
        newDiv.id = "invalid_email_reset";
        newDiv.setAttribute("role", "alert");
        newDiv.textContent = "Please Enter a valid Email Address";
        var parentDiv = document.getElementById("load_error");
        parentDiv.appendChild(newDiv);

        }
        else{
          console.log(data.message);
          $("#email_unsuccess_modal").modal("show");
        }
        
      }
    },
    error: function (xhr, status, error) {
      // Handle AJAX errors here
      console.error("Error:", error);
      // Show error message to the user
    },
  });
}

function open_password_reset_modal() {
  var divToRemove = document.getElementById("invalid_email_reset");
  if (divToRemove) {
    divToRemove.remove();
  }
  $("#password_reset_modal").modal("show");
}

function login() {
  event.preventDefault(); // Prevent the default form submission behavior
  console.log("Entered login function");
  email = document.getElementById("getemail").value;
  password = document.getElementById("getpassword").value;
  console.log("email : " + email);
  console.log("password : " + password);
  $.ajax({
    type: "POST",
    url: "/login",
    data: {
      email: email,
      password: password,
    },
    success: function (data) {
      if (data.success) {
        console.log(data.message);
        console.log(data.redirect);
        localStorage.setItem("cur_user", email);
        window.location.href = data.redirect;
      } else {
        // Handle unsuccessful login
        console.log(data.message);
        console.log(data.flag);
        if (data.flag == 3) {
          $("#incorrectusername").modal("show");
        } else if (data.flag == 2) {
          $("#incorrectpassword").modal("show");
        }
        // $('#incorrectusername').modal('show');
      }
    },
    error: function (xhr, status, error) {
      // Handle AJAX errors here
      console.error("Error:", error);
      // Show error message to the user
    },
  });
}

function signup() {
  event.preventDefault(); // Prevent the default form submission behavior
  console.log("Entered signup function");
  email = document.getElementById("getsignupemail").value;
  name = document.getElementById("getsignupname").value;
  password = document.getElementById("getsignuppassword").value;
  console.log("email : " + email);
  console.log("password : " + password);
  console.log("name : " + name);
  $.ajax({
    type: "POST",
    url: "/sign_up",
    data: {
      email: email,
      name: name,
      password: password,
    },
    success: function (data) {
      if (data.success) {
        console.log(data.message);
        verify_otp = data.otp;
        console.log(verify_otp);
        $("#opt_verify_modal").modal("show");
      } else {
        // Handle unsuccessful login
        console.log(data.message);
        if (data.flag == 1) {
          $("#email_exists").modal("show");
        }
      }
    },
    error: function (xhr, status, error) {
      // Handle AJAX errors here
      console.error("Error:", error);
      // Show error message to the user
    },
  });
}

function verifyotp() {
  var divToRemove = document.getElementById("invalid_email_reset_otp");
  if (divToRemove) {
    divToRemove.remove();
  }
  email = document.getElementById("getsignupemail").value;
  name = document.getElementById("getsignupname").value;
  password = document.getElementById("getsignuppassword").value;
  otp = document.getElementById("otp_to_verify").value;
  console.log(verify_otp);
  if (otp == verify_otp) {
    console.log("Verified OTP");
    $.ajax({
      type: "POST",
      url: "/verify_otp",
      data: {
        email: email,
        name: name,
        password: password,
      },
      success: function (data) {
        if (data.success) {
          console.log(data.message);
          $("#register_success").modal("show");
        } 
      },
      error: function (xhr, status, error) {
        // Handle AJAX errors here
        console.error("Error:", error);
        // Show error message to the user
      },
    });
  }
  else {
          // Handle unsuccessful login
          console.log("Incorrect OTP");
          var newDiv = document.createElement("div");
          newDiv.classList.add("alert", "alert-danger", "mt-3");
          newDiv.id = "invalid_email_reset_otp";
          newDiv.setAttribute("role", "alert");
          newDiv.textContent = "Incorrect OTP";
          var parentDiv = document.getElementById("load_error_otp");
          parentDiv.appendChild(newDiv);
        }
}

function page_reload() {
  window.location.href = "/";
}