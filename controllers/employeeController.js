const { getCollectionByName } = require("../collections");

// exports.getEmployees = async (req, res) => {
//   try {
//     const employeeIdsCollection = await getCollectionByName("employeeIds");

//     const employees = await employeeIdsCollection
//       .aggregate([
//         // { $limit: 5 },
//         {
//           $lookup: {
//             from: "learningHistory",
//             localField: "delegate_id",
//             foreignField: "delegate_id",
//             as: "learning_history",
//           },
//         },
//         {
//           $unwind: {
//             path: "$learning_history",
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//       ])
//       .toArray();
//     res.send(employees);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };


// exports.updateEmployee = async (req, res) => {
//     try {
//         const delegate_id = req.params.delegateId;
//         const updatedData = req.body;
//         const learningHistoryCollection = getCollectionByName("learningHistory");
//         const result = await learningHistoryCollection.updateOne(
//           { delegate_id: delegate_id },
//           { $set: updatedData }
//         );
//         if (result.modifiedCount > 0) {
//           res.send({ message: "employee details updated successfully" });
//         } else {
//           res.status(404).send({ message: "Employee not found" });
//         }
//       } catch (error) {
//         res.status(500).send(error);
//       }
// };



// exports.deleteEmployee = async (req, res) => {
//     const { delegateId } = req.params;
//     try {
//       // Delete the employee
//       // Delete the employee
//       const employeeIdsCollection = getCollectionByName("employeeIds");
//       await employeeIdsCollection.findOneAndDelete({ delegate_id: delegateId });
  
//       // Delete associated courses
//       const learningHistoryCollection = getCollectionByName("learningHistory");
//       await learningHistoryCollection.deleteMany({ delegate_id: delegateId });
  
//       res.status(200).json({ message: 'Employee and associated courses deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ error: 'Error deleting employee and courses' });
//     }
// };

// exports.addEmployee = async (req, res) => {
//     const { employee_id, delegate_id, first_name, last_name } = req.body;

//   if (!employee_id || !delegate_id || !first_name || !last_name) {
//     return res.status(400).send("Missing required fields");
//   }
//   try {
//     const employeeIdsCollection = getCollectionByName("employeeIds");
//     const learningHistoryCollection = getCollectionByName("learningHistory");

//     // Insert employee into employeeIds collection
//     await employeeIdsCollection.insertOne({
//       employee_id,
//       delegate_id,
//     });

//     // Insert learning history into learningHistory collection
//     await learningHistoryCollection.insertOne({
//       found: "true",
//       delegate_id,
//       first_name,
//       last_name,
//       records: [],
//     });

//     res.status(201).send("Employee added successfully");
//   } catch (error) {
//     res.status(500).send(error);
//   }
// }


// const { getCollectionByName } = require("../collections");

const getEmployees = async (req, res) => {
  try {
    const employeeIdsCollection = await getCollectionByName("employeeIds");

    const employees = await employeeIdsCollection
      .aggregate([
        {
          $lookup: {
            from: "learningHistory",
            localField: "delegate_id",
            foreignField: "delegate_id",
            as: "learning_history",
          },
        },
        {
          $unwind: {
            path: "$learning_history",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();
    res.send(employees);
  } catch (error) {
    res.status(500).send(error);
  }
};

const addEmployee = async (req, res) => {
  const { employee_id, delegate_id, first_name, last_name, active } = req.body;

  if (!employee_id || !delegate_id || !first_name || !last_name) {
    return res.status(400).send("Missing required fields");
  }
  try {
    const employeeIdsCollection = getCollectionByName("employeeIds");
    const learningHistoryCollection = getCollectionByName("learningHistory");

    await employeeIdsCollection.insertOne({ employee_id, delegate_id });
    await learningHistoryCollection.insertOne({
      found: active.toString(),
      delegate_id,
      first_name,
      last_name,
      records: [],
    });

    res.status(201).send("Employee added successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateEmployee = async (req, res) => {
  try {
    const delegate_id = req.params.delegateId;
    const updatedData = req.body;
    const learningHistoryCollection = getCollectionByName("learningHistory");
    const result = await learningHistoryCollection.updateOne(
      { delegate_id: delegate_id },
      { $set: updatedData }
    );
    if (result.modifiedCount > 0) {
      res.send({ message: "Employee details updated successfully" });
    } else {
      res.status(404).send({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteEmployee = async (req, res) => {
  const { delegateId } = req.params;
  try {
    const employeeIdsCollection = getCollectionByName("employeeIds");
    await employeeIdsCollection.findOneAndDelete({ delegate_id: delegateId });

    const learningHistoryCollection = getCollectionByName("learningHistory");
    await learningHistoryCollection.deleteMany({ delegate_id: delegateId });

    res.status(200).json({ message: 'Employee and associated courses deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting employee and courses' });
  }
};

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
