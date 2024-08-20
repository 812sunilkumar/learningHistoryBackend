const express = require("express");
const employeeController = require("../controllers/employeeController");

const router = express.Router();

router.get("/", employeeController.getEmployees);
router.put("/:delegateId", employeeController.updateEmployee); 
router.delete("/:delegateId", employeeController.deleteEmployee);
router.post("/addEmployee", employeeController.addEmployee)
module.exports = router;