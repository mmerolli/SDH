var express = require("express");
var cors = require("cors");
var app = express();
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const auth = require('authenticator');

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
   
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
  
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });


const router = express.Router()
const bcrypt = require('bcrypt');

var secret = 'qj2q ywxk sodn v3xj dc3y 5p4w ysr2 rzau';

app.use(express.json());
app.use(cors({
  origin: '*'
}));
app.use('/', router)

app.listen(3000, () => {
  console.log("Server running on port 3000"); // cambiato da 80 a 3000
});

//LAB7
// Configura il middleware di Multer per l'upload delle immagini


// Gestore dell'endpoint per il caricamento delle immagini
app.post('/home/foto', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nessuna immagine fornita' });
  }

  const photoPath = req.file.path;

  try {
    // Salva il percorso dell'immagine nel database utilizzando Prisma
    const createdImage = await prisma.image.create({
      data: {
        photo: photoPath,
      },
    });

    res.status(200).json({ id: createdImage.id, message: 'Immagine caricata con successo' });
  } catch (error) {
    console.error('Errore durante il salvataggio dell\'immagine nel database', error);
    res.status(500).json({ error: 'Errore durante il caricamento dell\'immagine' });
  }
});




//LAB5
//---------------------Login page----------------------------
const accounts = [];

//------------- restituisci account

router.get('/register', (req,res) => {
        res.json(accounts);
});

//----------------register

router.post('/register', async (req, res) => {
  const { email, hash } = req.body;
  const existingUser = accounts.find(obj => obj.email == email);
        if(!existingUser){
                accounts.push({
                        email,
                        hash
                });
		var qr = auth.generateTotpUri(secret, "SDH", "SDH", 'SHA1', 6, 30);
		await QRCode.toDataURL(qr , function (err, url) {
                	return res.status(200).json(url);
		});
        }
        return res.status(500);
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

//----------------- LAB 9
router.post('/otp', async (req, res) => {
  const {otp}  = req.body;
  const v = auth.verifyToken(secret, otp);
	console.log('akgdhfa'+ v);
	if(v === null){
		console.log('no')
		return res.status(500);
	}
	console.log('ye')
	res.status(201).json('');
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

// insert new patient on server
router.post('/patients', async (req, res) => {
	const patient = req.body;
	const newPatient = await prisma.patients.create({
		data: {
			firstname: patient.firstname,
			lastname: patient.lastname,
			email: patient.email,
		}
	});

	const allPatients = await prisma.patients.findMany();
	return res.json(allPatients)
})

//----
router.put('/patients/', async (req, res) => {
	const patient = req.body;
	const id = patient.id;

	const updatePatient = await prisma.patients.update({
		where: {id: parseInt(id)},
		data: patient,
	});
	const allPatients = await prisma.patients.findMany();
	return res.json(allPatients);

// Aggiorna solo i parametri specificati senza mantenere i vecchi valori
  const updatedPatient = await prisma.patients.update({
    where: { id: parseInt(id) },
    data: {
      ...(firstname && { firstname: { set: firstname } }),
      ...(lastname && { lastname: { set: lastname } }),
      ...(email && { email: { set: email } }),
    },
  });
 return  res.json(updatedPatient);
});

//----
router.delete('/patients/:id', async (req, res) => {
  const { id } = req.params;
  // Elimina il paziente
  const deletedPatient = await prisma.patients.delete({
    where: { id: parseInt(id) },
  });
  const allPatients = await prisma.patients.findMany();
  res.json(allPatients);
});


/*
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
  const index = patients.findIndex(patient => patient.email === email);

  if (index !== -1) {
    patients.splice(index, 1);
    res.send(patients);
  } else {
    res.status(404).json({ error: 'Patient not found' });
  }
});

*/
