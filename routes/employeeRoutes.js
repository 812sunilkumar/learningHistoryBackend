// const express = require("express");
// const employeeController = require("../controllers/employeeController");

// const router = express.Router();

// router.get("/", employeeController.getEmployees);
// router.put("/:delegateId", employeeController.updateEmployee); 
// router.delete("/:delegateId", employeeController.deleteEmployee);
// router.post("/addEmployee", employeeController.addEmployee)
// module.exports = router;

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
