const express = require("express");
const router = express.Router();
const {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

// Define routes without the "/api" prefix
router.get("/", getEmployees); // Matches /api/employee/
router.post("/addEmployee", addEmployee); // Matches /api/employee/addEmployee
router.put("/:delegateId", updateEmployee); // Matches /api/employee/:delegateId
router.delete('/:delegateId', deleteEmployee); // Matches /api/employee/:delegateId

module.exports = router;
