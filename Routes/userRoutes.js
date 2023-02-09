import express from "express";
import verify from "../middlewares/verify.js";
import Users from "../mongoDB/models/users.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'public/images/');
    },
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() +  '.' + file.originalname.split('.').pop());
    }
  });
  
  const upload = multer({ storage: storage });

const userRoutes = express.Router()

// userRoutes.get('/users', verify, async (req, res) => {
//     try {
//         res.json(req.user)
//     }
//     catch(err){
//         res.json(err)
//     }
// })

userRoutes.get('/users', (req, res) => {
    Users
    .find()
    .then(user => 
        res.json(user)
        )
    .catch(err => res.json(err))
})

userRoutes.get('/users/:id', (req, res) => {
    Users
    .findOne({_id : req.params.id})
    .then(user => 
        res.json(user)
        )
    .catch(err => res.json(err))
})

userRoutes.put('/users/:id', upload.single('image'), async (req,res) => {
    await Users.findOneAndUpdate({_id : req.params.id}, 
        {$set :{username: req.body.username,
         image: "/public/images/" + req.file.filename,
         first_name : req.body.first_name,
         last_name : req.body.last_name,
         email : req.body.email
            }}, 
         {new : true})
    .then(newUser => res.json(newUser))
    .catch(err => res.json(err))
})


export default userRoutes;