var express = require("express");
var cors = require("cors");
var app = express();
const router = express.Router()

app.use(express.json());
app.use(cors({
  origin: '*'
}));
app.use('/', router)

app.listen(3000, () => {

console.log("Server running on port 80")
});

const patients = [
  {
    "firstname": "martina",
    "lastname": "merolli",
    "email": "martina@merolli.com",
    "password": "lalalal"
  }
];

// Get all Method
//router.get('/patients', (req, res) => {
  //res.json(patients)
})

// Get by ID Method
router.get('/patients', (req, res) => {
  const patient = patients.find(p => p.id= req.params.id)
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
router.delete('/patients/:index', (req, res) => {
  // Get the index of the patient to remove from the URL parameter
  const index = parseInt(req.params.index);

  // Check if the index is valid
  if (isNaN(index) || index < 0 || index >= patients.length) {
    res.status(400).send("Invalid index provided.");
    return;
  }

  // Remove the patient from the patients array by index
  patients.splice(index, 1);

  // Send a response with the updated patients array
  res.send(patients);
});

