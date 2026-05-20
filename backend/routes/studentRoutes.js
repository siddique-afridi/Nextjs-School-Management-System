const express = require ('express');
const auth = require ('../middleware/auth');
// const validateCreateStudent = require('../middleware/studentValidator/createValidator')
const { getStudents, createStudent, getStudentById, updateStudent, deleteStudent, getNearByStudents,getNearbyStudentsByCity } = require('../controllers/student');
// const updateValidator = require('../middleware/studentValidator/updateValidator');
const upload = require('../config/multerConfig');
const uploadProfile = require('../controllers/uploadProfile');
const { authorizeRoles } = require('../middleware/authorizeRoles');

const router = express.Router();

router.get('/', 
  auth, 
  getStudents);

// console.log("auth:", auth);
router.post('/',
     auth,
    //  validateCreateStudent,
    authorizeRoles("teacher", "admin"),
      createStudent
    );

router.delete('/:id', 
  auth,
  authorizeRoles("teacher", "admin"),
   deleteStudent)

router.put('/:id', 
  auth,
  authorizeRoles("teacher", "admin"),
  // updateValidator,
  updateStudent,
);
// console.log("createStudent:", createStudent);

router.post('/upload-profile',
   upload.single("profileImage"),
    uploadProfile)


    router.get('/nearbyCity', 
      // getNearByStudents,
      getNearbyStudentsByCity
    );


module.exports = router;