var express = require("express");
var cors = require("cors");
var app = express();

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const router = express.Router()
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cors({
  origin: '*'
}));
app.use('/', router)

app.listen(3000, () => {
  console.log("Server running on port 3000"); // cambiato da 80 a 3000
});

//LAB5
//---------------------Login page----------------------------

const accounts = [];

//------------- restituisci account

router.get('/register', (req,res) => {
        res.json(accounts);
});

//----------------register

router.post('/register', (req, res) => {
  const { email, hash } = req.body;
  const existingUser = accounts.find(obj => obj.email == email);
        if(!existingUser){
                accounts.push({
                        email,
                        hash
                });
 res.status(200);
        }
        res.status(500);
});
//--------------- login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
        console.log({email,password});
  const existingUser = accounts.find(obj => obj.email == email);
  if (existingUser) {
    if (bcrypt.compareSync(password, existingUser.hash )) {
      res.status(200).json({message: "authenticated successfully!!"});
   console.log('bene'); } else {
      res.status(500).json({error:"The provided password is incorrect!"});
    console.log('male1');}
  } else {
res.status(500).json({error:"The provided email does not exist!"});
 console.log('male2'); }
});

//LAB6
//---------- Database

router.get('/patients', async (req, res) => {
const allPatients = await prisma.patients.findMany();
  res.json(allPatients)
})
//----
router.get('/patients/:id', async (req, res) => {
  const { id } = req.params
  const patients = await prisma.patients.findUnique({
    where: { id: parseInt(id)  }
  })

  const allPatients = await prisma.patients.findMany();
  res.json(allPatients)
})

//----

router.post('/patients', async (req, res) => {
  const { firstname, lastname, email } = req.body
  const patients = await prisma.patients.create({
    data: { firstname, lastname, email }
  })
  const allPatients = await prisma.patients.findMany();
  res.json(allPatients)
})

//----

router.put('/patients:/id', async (req, res) => {
  const { id } = req.params
  const { firstname, lastname, email } = req.body
  const patients = await prisma.patients.update({where: { id: parseInt(id) },
    data: { firstname, lastname, email }
  })
  const allPatients = await prisma.patients.findMany();
  res.json(allPatients)
})
//---
router.delete('/patients/:email', async (req, res) => {
  const { email } = req.params
        console.log(email)
  const patient = await prisma.patients.delete({
          where: { email }  })
const allPatients = await prisma.patients.findMany();
  res.json(allPatients)
})

// LAB3/4 connection between server <--> client with http/https

const patients = [
  {
    "firstname": "martina",
    "lastname": "merolli",
    "email": "martina@merolli.com",
    "password": "lalalal"
  }
];




// Get by ID Method
router.get('/patients', (req, res) => {
  const patient = patients.find(p => p.id == req.params.id)
  res.json(patients)
})

//Post Method
router.post('/patients', (req, res) => {
  // Get the patient object from the request body
   const newPatient = req.body;
  // Add the new patient to the patients array
  patients.push(newPatient);
  // Send a response with the updated patients array
  res.send(patients);

})

// Update by Index Method
router.put('/patients/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const patient = patients[index];

if (!patient) {
    res.status(404).json({ message: 'Patient not found.' });
  } else {
const updatedPatient = {
      ...patient,
      ...req.body
    };

    patients[index] = updatedPatient;

    res.json(updatedPatient);
  }
});

//Delete by index Method
// Delete by email Method
router.delete('/patients/:email', (req, res) => {
  const email = req.params.email;
  const index = patients.findIndex(patient => patient.email === email);  if (index !== -1) {
    patients.splice(index, 1);
    res.send(patients);
  } else {
    res.status(404).json({ error: 'Patient not found' });
  }
});


