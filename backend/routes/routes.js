import { Router } from "express";

import { adminRegister, adminLogIn, getAdminDetail } from "../controllers/adminController.js";
import {
  sclassCreate,
  sclassList,
  deleteSclass,
  deleteSclasses,
  getSclassDetail,
  getSclassStudents,
} from "../controllers/classController.js";
import { complainCreate, complainList } from "../controllers/complainController.js";
import {
  noticeCreate,
  noticeList,
  deleteNotices,
  deleteNotice,
  updateNotice,
} from "../controllers/noticeController.js";
import {
  studentRegister,
  studentLogIn,
  getStudents,
  getStudentDetail,
  deleteStudents,
  deleteStudent,
  updateStudent,
  studentAttendance,
  deleteStudentsByClass,
  updateExamResult,
  clearAllStudentsAttendanceBySubject,
  clearAllStudentsAttendance,
  removeStudentAttendanceBySubject,
  removeStudentAttendance,
} from "../controllers/studentController.js";
import {
  subjectCreate,
  classSubjects,
  deleteSubjectsByClass,
  getSubjectDetail,
  deleteSubject,
  freeSubjectList,
  allSubjects,
  deleteSubjects,
} from "../controllers/subjectController.js";
import {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  deleteTeachers,
  deleteTeachersByClass,
  deleteTeacher,
  updateTeacherSubject,
  teacherAttendance,
} from "../controllers/teacherController.js";
import verify_Token from "../middleware/verifyToken.js";
import authorizeRoles  from "../middleware/authorizeRoles.js";

const router = Router();

router.post("/AdminReg", adminRegister);
router.post("/AdminLogin", adminLogIn);
router.get("/Admin/:id", verify_Token , authorizeRoles , getAdminDetail);

router.post("/StudentReg", verify_Token , authorizeRoles , studentRegister);
router.post("/StudentLogin", studentLogIn);
router.get("/Students/:id", verify_Token , authorizeRoles , getStudents);
router.get("/Student/:id", verify_Token , authorizeRoles , getStudentDetail);
router.delete("/Students/:id", verify_Token , authorizeRoles , deleteStudents);
router.delete("/StudentsClass/:id", verify_Token , authorizeRoles , deleteStudentsByClass);
router.delete("/Student/:id", verify_Token , authorizeRoles , deleteStudent);
router.put("/Student/:id", verify_Token , authorizeRoles , updateStudent);
router.put("/UpdateExamResult/:id", verify_Token , authorizeRoles , updateExamResult);
router.put("/StudentAttendance/:id", verify_Token , authorizeRoles , studentAttendance);
router.put("/RemoveAllStudentsSubAtten/:id", verify_Token , authorizeRoles , clearAllStudentsAttendanceBySubject);
router.put("/RemoveAllStudentsAtten/:id", verify_Token , authorizeRoles , clearAllStudentsAttendance);
router.put("/RemoveStudentSubAtten/:id", verify_Token , authorizeRoles , removeStudentAttendanceBySubject);
router.put("/RemoveStudentAtten/:id", verify_Token , authorizeRoles , removeStudentAttendance);

router.post("/TeacherReg", verify_Token , authorizeRoles , teacherRegister);
router.post("/TeacherLogin", teacherLogIn);
router.get("/Teachers/:id", verify_Token , authorizeRoles , getTeachers);
router.get("/Teacher/:id", verify_Token , authorizeRoles , getTeacherDetail);
router.delete("/Teachers/:id", verify_Token , authorizeRoles , deleteTeachers);
router.delete("/TeachersClass/:id", verify_Token , authorizeRoles , deleteTeachersByClass);
router.delete("/Teacher/:id", verify_Token , authorizeRoles , deleteTeacher);
router.put("/TeacherSubject", verify_Token , authorizeRoles , updateTeacherSubject);
router.post("/TeacherAttendance/:id", verify_Token , authorizeRoles , teacherAttendance);

router.post("/NoticeCreate", verify_Token , authorizeRoles , noticeCreate);
router.get("/NoticeList/:id", verify_Token , authorizeRoles , noticeList);
router.delete("/Notices/:id", verify_Token , authorizeRoles , deleteNotices);
router.delete("/Notice/:id", verify_Token , authorizeRoles , deleteNotice);
router.put("/Notice/:id", verify_Token , authorizeRoles , updateNotice);

router.post("/ComplainCreate", verify_Token , authorizeRoles , complainCreate);
router.get("/ComplainList/:id", verify_Token , authorizeRoles , complainList);

router.post("/SclassCreate", verify_Token , authorizeRoles , sclassCreate);
router.get("/SclassList/:id", verify_Token , authorizeRoles , sclassList);
router.get("/Sclass/:id", verify_Token , authorizeRoles , getSclassDetail);
router.get("/Sclass/Students/:id", verify_Token , authorizeRoles , getSclassStudents);
router.delete("/Sclasses/:id", verify_Token , authorizeRoles , deleteSclasses);
router.delete("/Sclass/:id", verify_Token , authorizeRoles , deleteSclass);

router.post("/SubjectCreate", verify_Token , authorizeRoles , subjectCreate);
router.get("/AllSubjects/:id", verify_Token , authorizeRoles , allSubjects);
router.get("/ClassSubjects/:id", verify_Token , authorizeRoles , classSubjects);
router.get("/FreeSubjectList/:id", verify_Token , authorizeRoles , freeSubjectList);
router.get("/Subject/:id", verify_Token , authorizeRoles , getSubjectDetail);
router.delete("/Subject/:id", verify_Token , authorizeRoles , deleteSubject);
router.delete("/Subjects/:id", verify_Token , authorizeRoles , deleteSubjects);
router.delete("/SubjectsClass/:id", verify_Token , authorizeRoles , deleteSubjectsByClass);

export default router;
