// const express = require("express");
// const learningHistoryController = require("../controllers/learningHistoryController");

// const router = express.Router();

// // router.get("/", learningHistoryController.getLearningHistory);
// // router.post("/:delegate_id", learningHistoryController.addCourse);
// // router.put("/:delegate_id/:course_code", learningHistoryController.updateCourse);
// // router.delete("/:delegate_id/:course_code", learningHistoryController.deleteCourse);

// module.exports = router;


const express = require("express");
const router = express.Router();
const {
  getLearningHistory,
  addCourse,
  updateCourse,
  deleteCourse,
  getCourseCode
} = require("../controllers/learningHistoryController");

// Define routes without the "/api" prefix
router.get("/", getLearningHistory); // Matches /api/learninghistory/
router.post("/:delegate_id", addCourse); // Matches /api/learninghistory/:delegate_id
router.put("/:delegate_id/:course_code", updateCourse); // Matches /api/learninghistory/:delegate_id/:course_code
router.delete('/:delegateId/:courseCode', deleteCourse); // Matches /api/learninghistory/:delegateId/:courseCode
router.get("/getCourseCode", getCourseCode);

module.exports = router;
