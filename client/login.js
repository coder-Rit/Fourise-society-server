const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

async function signUp() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const flat = document.getElementById("flat").value;
  const wing = document.getElementById("wing").value;
  const userType = document.getElementById("userType").value;

  const formData = {
    name: name,
    phoneNumber: phone,
    email: email,
    password: password,
    flatNumber: flat,
    wing: wing,
    userType: userType,
  };

  console.log("1");

  try {
    const response = await fetch(
      "http://localhost:4000/api/v1/signup",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok === false) {
      console.log("error");
      return;
    }

    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.log(error);
  }
  console.log("2");
}
