<template>
  <div v-if="isLoggedIn">
    <button class="text-black bg-red-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" @click="DeleteCookie">
      Delete Cookie
    </button>
    <div class="flex m-6">
      <div class="flex grow p-4 border rounded-lg mx-auto" >


        <form name="patientForm" id="patientForm1234" class="w-full p-4">
          <div>
            <label for="firstname">Firstname</label>
            <input v-model="patient.firstname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" type="text" name="firstname"
              id="firstname" required placeholder="Enter your firstname here ..." />
          </div>

          <br />
          <div>
            <label for="lastname">Lastname</label>
            <input v-model="patient.lastname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" type="text" name="lastname" id="lastname" required
              placeholder="Enter your lastname here ..." />
          </div>
          <br />
          <div>
            <label for="email">Email</label>
            <input v-model="patient.email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" type="email" name="email" id="email" required
              placeholder="Enter your email here ..." />
          </div>
          <br />
          <div>
            <label for="password">Password</label>
            <input v-model="patient.password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" type="password" name="password" id="password" required
              placeholder="Enter your password here ..." />

            <div class="mt-12">
              <input type="file" @change="handleImageChange" />
             <img :src="imageUrl" alt="" :style="{ maxHeight: '100px'}"/>
            </div>

          </div>
          <br />
          <div v-if="isEditing">
            <button id="sub" class="text-black bg-red-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" @click.prevent="saveEdit">Save</button>
            <button id="sub" class="text-black bg-red-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" @click.prevent="cancelEdit">Cancel</button>
          </div>
          <button v-else class="text-black bg-green-400 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" id="sub" @click.prevent="saveForm">Submit</button>



        </form>
      </div>




      <div class="flex border p-4 rounded-md ml-4">
        <table id="mytable">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            
          </tr>
          <tr v-for="patient in patients" :key="patient.id">
            <td>{{ patient.firstname }} {{ patient.lastname }}</td>
            <td>{{ patient.email }}</td>
            <td class="">•••••••</td>
           
            <td>
              <button class="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-2 py-1 text-center mr-2" @click="editP(patient)">edit</button>
              <button class="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-2 py-1 text-center mr-2" @click="deleteP(patient.id)">delete</button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>




  <!-- QUI INIZIA LA PAGINA DI LOGIN -->
  <div v-else class="w-96 mx-auto mt-32 border rounded-md shadow p-6">
    <div v-if="!showOTP">
    <h2 class="font-bold text-xl mb-8">Login Page</h2>
    <div>
      <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email:</label>
      <input type="email" id="email" v-model="email" placeholder="Enter your email here ..." class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />

      <div>
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 mt-4">Password:</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password here ..."
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          @input="checkPasswordStrength" required />
        <div v-if="password">
          <div>Password strength: {{ passwordStrength }}</div>
          <div v-if="passwordStrength === 'Weak'">
            Please choose a stronger password.
          </div>
        </div>
      </div>
      <img :src="qr" alt="" />
      <br />
      <button @click="login" class="text-white bg-pink-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mr-2">Login</button>
      <button @click="register" class="text-white bg-pink-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" >Sign in</button>
    </div>
    </div>
  <div v-if="showOTP"> 
    <label for="password" class="block mb-2 text-sm font-medium text-gray-900">OTP:</label>
        <input  v-model="this.otp" placeholder="Enter your otp code here ..."
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        @input="checkPasswordStrength" required />
          <button @click="verifyOTP" class="text-white mt-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mr-2">Verify</button>
  </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie';
import axios from "axios";
import bcrypt from 'bcryptjs';



export default {
  data() {
    return {
      imageUrl: '',
      otp: '',
      qr: '',
      showOTP: true,
      isLoggedIn: false,
      email: "",
      password: "",
      passwordStrength: "",
      errors: [],
      patients: [],
      patient: {
        id: "",
        firstname: "",
        lastname: "",
        email: "",
        selectedImage: null,
      },
      isEditing: false,

    };
  },
  //------------lab4
  mounted() {
    this.loadData();
  },
  created() {
    const cookie = Cookies.get('auth')
    if (cookie) {
      const { email, password } = JSON.parse(Cookies.get('auth'))
      axios
        .post(`https://sdh1lab4.crabdance.com/login`, { email: email, password: password })
        .then(async (response) => {
          if (response.status === 200) {
            this.showOTP = true;
          }
        })
        .catch((error) => {
          this.errors.push(error);
          alert("Your password or email is incorrect");
        });
    }
  },
  methods: {
    handleImageChange(event) {
      const file = event.target.files[0];
      this.imageUrl = URL.createObjectURL(file);
    },
    verifyOTP(){
      axios
        .post(`https://sdh1lab4.crabdance.com/otp`, {otp : this.otp})
        .then((response) => {
          console.log(response.status)
          if (response.status === 201){
            console.log('funzia')
            this.showOTP = false;
            this.isLoggedIn = true;
          }
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    saveEdit(){
      const patient = this.patient
      axios
        .put(`https://sdh1lab4.crabdance.com/patients`, patient)
        .then((response) => {
          this.patients = response.data;
        })
        .catch((e) => {
          this.errors.push(e);
        });

      this.patient = {
        id: "",
        firstname: "",
        lastname: "",
        email: "",
        password: ""
      };
      this.isEditing = false;
    },
    cancelEdit(){
      this.isEditing = false;
      this.patient = {
        id: "",
        firstname: "",
        lastname: "",
        email: "",
        selectedImage: null,
      };
    },
    DeleteCookie() {
      Cookies.remove('auth')
    },
    saveForm() {
      if (this.patient.firstname === "" || this.patient.lastname === "" || this.patient.email === "" || this.patient.password === "") {
        return;
      }
      // Controllo email
      if (!this.patient.email.includes("@")) {
        alert("L'indirizzo email non è valido!");
        return;
      }
      axios
        .post(`https://sdh1lab4.crabdance.com/patients`, this.patient)
        .then((response) => {
          this.patients = response.data;
          console.log[this.patients]
        })
        .catch((e) => {
          this.errors.push(e);
        });

      this.patient = {
        id: "",
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
          console.log(this.patients)
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    editP(patient) {
      this.patient = patient;
      this.isEditing = true;
    },
    deleteP(id) {
      axios
        .delete(`https://sdh1lab4.crabdance.com/patients/${id}`)
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

      await axios
        .post(`https://sdh1lab4.crabdance.com/login`, { email: this.email, password: this.password })
        .then(async (response) => {
          if (response.status === 200) {
            //this.isLoggedIn = true;
            this.showOTP = true;
            await Cookies.set('auth', JSON.stringify({
              email: this.email,
              password: this.password,
            }), {
              expires: 1,
              sameSite: 'Strict'
            })
            // login successful
            console.log("Login successful");
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
        .then((response) => {
          console.log(response.data)
          this.qr = response.data;
          console.log(this.qr);
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
    },

    //LAB7
    handleFileChange(event) {
      this.selectedImage = event.target.files[0];
    },
    uploadImage() {
      const formData = new FormData();
      formData.append('image', this.selectedImage);

      // Effettua una richiesta POST utilizzando Axios
      axios.post('/home/foto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(() => {
          // Gestisci il caricamento riuscito
          console.log('Immagine caricata con successo');
        })
        .catch((error) => {
          // Gestisci l'errore
          console.error('Errore durante il caricamento dell\'immagine', error);
        });
    },
  },
}


</script>


<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
/*
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
  box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
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
  margin-bottom: 0px;
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

.table-container {
  display: flex;
  align-items: center;
}

.table-container table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
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

.file-upload {
  box-shadow: 2px 2px 9px 2px #ccc;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 1rem;
  width: 60%;
  margin: 0 auto;
}

input {
  font-size: 0.9rem;
}

input,
div,
button {
  margin-top: 0.6rem;
}

.upload-button {
  width: 7rem;
  padding: 0.5rem;
  background-color: #278be9;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 1rem;
}

.upload-button:disabled {
  background-color: #b3bcc4;
  cursor: no-drop;
}*/
</style>
