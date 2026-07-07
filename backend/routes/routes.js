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
import authorizeRoles from "../middleware/authorizeRoles.js";
import logout from "../controllers/logout.js";
import me from "../controllers/meController.js";

const router = Router();

router.get("/Me", verify_Token, me);
router.post("/Logout", verify_Token, logout);

router.post("/AdminReg", adminRegister);
router.post("/AdminLogin", adminLogIn);
router.get("/Admin/:id", verify_Token , authorizeRoles("Admin") , getAdminDetail);

router.post("/StudentReg", verify_Token , authorizeRoles("Admin") , studentRegister);
router.post("/StudentLogin", studentLogIn);
router.get("/Students/:id", verify_Token , authorizeRoles("Admin") , getStudents);
router.get("/Student/:id", verify_Token , authorizeRoles("Admin") , getStudentDetail);
router.delete("/Students/:id", verify_Token , authorizeRoles("Admin") , deleteStudents);
router.delete("/StudentsClass/:id", verify_Token , authorizeRoles("Admin") , deleteStudentsByClass);
router.delete("/Student/:id", verify_Token , authorizeRoles("Admin") , deleteStudent);
router.put("/Student/:id", verify_Token , authorizeRoles("Admin") , updateStudent);
router.put("/UpdateExamResult/:id", verify_Token , authorizeRoles("Admin") , updateExamResult);
router.put("/StudentAttendance/:id", verify_Token , authorizeRoles("Admin") , studentAttendance);
router.put("/RemoveAllStudentsSubAtten/:id", verify_Token , authorizeRoles("Admin") , clearAllStudentsAttendanceBySubject);
router.put("/RemoveAllStudentsAtten/:id", verify_Token , authorizeRoles("Admin") , clearAllStudentsAttendance);
router.put("/RemoveStudentSubAtten/:id", verify_Token , authorizeRoles("Admin") , removeStudentAttendanceBySubject);
router.put("/RemoveStudentAtten/:id", verify_Token , authorizeRoles("Admin") , removeStudentAttendance);

router.post("/TeacherReg", verify_Token , authorizeRoles("Admin") , teacherRegister);
router.post("/TeacherLogin", teacherLogIn);
router.get("/Teachers/:id", verify_Token , authorizeRoles("Admin") , getTeachers);
router.get("/Teacher/:id", verify_Token , authorizeRoles("Admin") , getTeacherDetail);
router.delete("/Teachers/:id", verify_Token , authorizeRoles("Admin") , deleteTeachers);
router.delete("/TeachersClass/:id", verify_Token , authorizeRoles("Admin") , deleteTeachersByClass);
router.delete("/Teacher/:id", verify_Token , authorizeRoles("Admin") , deleteTeacher);
router.put("/TeacherSubject", verify_Token , authorizeRoles("Admin") , updateTeacherSubject);
router.post("/TeacherAttendance/:id", verify_Token , authorizeRoles("Admin") , teacherAttendance);

router.post("/NoticeCreate", verify_Token , authorizeRoles("Admin") , noticeCreate);
router.get("/NoticeList/:id", verify_Token , authorizeRoles("Admin") , noticeList);
router.delete("/Notices/:id", verify_Token , authorizeRoles("Admin") , deleteNotices);
router.delete("/Notice/:id", verify_Token , authorizeRoles("Admin") , deleteNotice);
router.put("/Notice/:id", verify_Token , authorizeRoles("Admin") , updateNotice);

router.post("/ComplainCreate", verify_Token , authorizeRoles("Admin") , complainCreate);
router.get("/ComplainList/:id", verify_Token , authorizeRoles("Admin") , complainList);

router.post("/SclassCreate", verify_Token , authorizeRoles("Admin") , sclassCreate);
router.get("/SclassList/:id", verify_Token , authorizeRoles("Admin") , sclassList);
router.get("/Sclass/:id", verify_Token , authorizeRoles("Admin") , getSclassDetail);
router.get("/Sclass/Students/:id", verify_Token , authorizeRoles("Admin") , getSclassStudents);
router.delete("/Sclasses/:id", verify_Token , authorizeRoles("Admin") , deleteSclasses);
router.delete("/Sclass/:id", verify_Token , authorizeRoles("Admin") , deleteSclass);

router.post("/SubjectCreate", verify_Token , authorizeRoles("Admin") , subjectCreate);
router.get("/AllSubjects/:id", verify_Token , authorizeRoles("Admin") , allSubjects);
router.get("/ClassSubjects/:id", verify_Token , authorizeRoles("Admin") , classSubjects);
router.get("/FreeSubjectList/:id", verify_Token , authorizeRoles("Admin") , freeSubjectList);
router.get("/Subject/:id", verify_Token , authorizeRoles("Admin") , getSubjectDetail);
router.delete("/Subject/:id", verify_Token , authorizeRoles("Admin") , deleteSubject);
router.delete("/Subjects/:id", verify_Token , authorizeRoles("Admin") , deleteSubjects);
router.delete("/SubjectsClass/:id", verify_Token , authorizeRoles("Admin") , deleteSubjectsByClass);

export default router;
