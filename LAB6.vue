<template>
  <div v-if="isLoggedIn">
    <div class="container">
      <div class="left-column">
        <h1>  </h1>

        <form name="patientForm" id="patientForm1234" class="mform">
          <div>
            <label for="firstname">Firstname</label>
            <input
              v-model="patient.firstname"
              class="form-input class2 class3"
              type="text"
              name="firstname"
              id="firstname"
              required
              placeholder="Enter your firstname here ..."
            />
          </div>

          <br />
          <div>
            <label for="lastname">Lastname</label>
            <input
              v-model="patient.lastname"
              class="form-input"
              type="text"
              name="lastname"
              id="lastname"
              required
              placeholder="Enter your lastname here ..."
            />
          </div>
          <br />
          <div>
            <label for="email">Email</label>
            <input
              v-model="patient.email"
              type="email"
              name="email"
              id="email"
              required
              placeholder="Enter your email here ..."
            />
          </div>
          <br />
          <div>
            <label for="password">Password</label>
            <input
              v-model="patient.password"
              type="password"
              name="password"
              id="password"
              required
              placeholder="Enter your password here ..."
            />
          </div>
          <br />
          <button id="sub" @click.prevent="saveForm">Submit</button>
        </form>

        <form @submit.prevent="submitForm">
          <input type="file" ref="fileInput" />
          <button type="submit">Invia</button>
        </form>
      </div>

      <div class="right-column">
        <table id="mytable">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
          </tr>
          <tr v-for="(patient, i) in patients" :key="patient.email">
            <td>{{ patient.firstname }} {{ patient.lastname }}</td>
            <td>{{ patient.email }}</td>
            <td>{{ patient.password }}</td>
            <td>-</td>
            <td>
              <button @click="editP(i, patient)">edit</button>
              <button @click="deleteP(patient.email)">delete</button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>





 <!-- QUI INIZIA LA PAGINA DI LOGIN -->
  <div v-else>
    <h2>Login Page</h2>
    <div>
      <label for="email">Email:</label>
      <input
        type="email"
        id="email"
        v-model="email"
        placeholder="Enter your email here ..."
        required
        
        
      />
     
      <div>
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter your password here ..."
          @input="checkPasswordStrength"
          required
        />
        <div v-if="password">
          <div>Password strength: {{ passwordStrength }}</div>
          <div v-if="passwordStrength === 'Weak'">
            Please choose a stronger password.
          </div>
        </div>
      </div>

      <br />
      <button @click="login">Login</button>
      <button @click="register">Sign in</button>
    </div>
  </div>
  
</template>

<script>
import axios from "axios";
import bcrypt from 'bcryptjs';

export default {
  data() {
    return {
      isLoggedIn: false,
      email: "",
      password: "", 
      passwordStrength: "",
      errors: [],
      patients: [],
      patient: {
        firstname: "",
        lastname: "",
        email: "",
       
      },
    
    };
  },
  //------------lab4
  mounted() {
    this.loadData();
  },
  methods: {
    saveForm() {
      if(this.patient.firstname === "" || this.patient.lastname === "" || this.patient.email==="" || this.patient.password === ""){
        return;
      }
      // Controllo email
      if (!this.patient.email.includes("@")) {
        alert("L'indirizzo email non è valido!");
        return;
      }
      axios
        .post(`https://sdh1lab4.crabdance.com/patients`, this.patient) // corretto metodo da PUT a POST
        .then((response) => {
          this.patients = response.data;
        })
        .catch((e) => {
          this.errors.push(e);
        });

      this.patient = {
        firstname: "",
        lastname: "",
        email: "",
        password: ""
      };
    },
    loadData() {
      axios
        .get(`https://sdh1lab4.crabdance.com/patients`)
        .then((response) => {
          this.patients = response.data;
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    editP(i, data) {
      this.deleteP(data.id); // chiamata deleteP con id del paziente
      this.patient = data;
    },
    deleteP(email) {
  axios
    .delete(`https://sdh1lab4.crabdance.com/patients/${email}`)
    .then((response) => {
      this.patients = response.data;
    })
    .catch((e) => {
      this.errors.push(e);
    });
},
//------------------- Lab5
    async login() {
      this.submitted = true;
      if (this.email === "" || this.password === "") {
        return;
      }

      axios
        .post(`https://sdh1lab4.crabdance.com/login`, { email: this.email, password: this.password })
        .then(async (response) => {
          if (response.status === 200) {
            this.isLoggedIn = true;
            console.log("Login successful");
            // login successful
          }
        })
        .catch((error) => {
          this.errors.push(error);
          alert("Your password or email is incorrect");
        });

      this.password = "";
      this.email = "";
    },


    async register() {
      if (this.email === "" || this.password === "") {
        return;
      }

      // Controllo email
      if (!this.email.includes("@")) {
        alert("L'indirizzo email non è valido!");
        return;
      }

      const hash = await bcrypt.hash(this.password, 10);

      axios
        .post(`https://sdh1lab4.crabdance.com/register`, {
          email: this.email,
          hash: hash
        })
        .then(() => {
          alert("Registrazione effettuata con successo!");
        })
        .catch((error) => {
          this.errors.push(error);
          alert("Registrazione fallita");
        });
      
      this.password = "";
      this.email = "";
    },

    checkPasswordStrength() {
      const password = this.password;
      if (password.length < 8) {
        this.passwordStrength = "Weak";
      } else if (password.length < 12) {
        this.passwordStrength = "Moderate";
      } else {
        this.passwordStrength = "Strong";
      }
    }
  }
};

    //--------------------
  /*async submitForm() {
  const fileInput = this.$refs.fileInput;
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}*/
 </script>


<style>
.is-invalid {
  border-color: red;
}

:root {
  --white-color: whitesmoke;
  --first-color: #991f1f;
  --light-color: #faafaf;
}

* {
  box-sizing: border-box;
}

body {
  background-color: var(--white-color);
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container {
  display: flex;
}

.left-column {
  flex: 1;
  padding: 20px;
}

.right-column {
  flex: 1;
  padding: 20px;
}

.form {
  background-color: var(--light-color);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
  color: #FF8787;
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}


input[type="text"],
input[type="email"],
input[type="password"],
select {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  display: inline-block;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  color: #555;
  background: linear-gradient(to bottom, #f5f5f5, #e5e5e5);
  box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus,
select:focus {
  outline: none;
  border-color: var(--first-color);
  box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.1), 0 0 3px rgba(153, 31, 31, 0.2);
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 1rem;
  font-weight: 600;
  color: #444;
}

.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.button-container button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.button-container button.login-btn {
  background-color: var(--first-color);
  margin-right: 10px;
}

.button-container button.register-btn {
  background-color: #555;
}

.button-container button:hover {
  background-color: var(--first-color);
}

.login-interface {
  margin-top: 30px;
  text-align: center;
}

.login-interface p {
  color: var(--first-color);
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.login-interface a {
  color: var(--first-color);
  text-decoration: underline;
}

.login-interface a:hover {
  color: #555;
}

.table-container {
  display: flex;
  align-items: center;
}

.table-container table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table-container th,
.table-container td {
  padding: 10px;
  text-align: left;
}

.table-container th {
  background-color: var(--first-color);
  color: #fff;
}

.table-container tr:nth-child(even) {
  background-color: var(--light-color);
}

.table-container button {
  margin-right: 5px;
}

.login-button {
  /* Stile del pulsante di login */
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.2s ease-in-out;
}

.login-button:hover {
  background-color: #0056b3;
}

.signin-button {
  /* Stile del pulsante di sign in */
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.signin-button:hover {
  background-color: #218838;
}

#sub {
  margin-top: 20px;
  margin-bottom: 20px;
}

</style>
