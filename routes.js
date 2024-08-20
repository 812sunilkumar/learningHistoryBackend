const express = require("express");
const router = express.Router();
const { getCollectionByName } = require("./collections");

router.get("/employees", async (req, res) => {
  try {
    const employeeIdsCollection = await getCollectionByName("employeeIds");

    const employees = await employeeIdsCollection
      .aggregate([
        // { $limit: 5 },
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
});
router.get("/learninghistory", async (req, res) => {
  try {
    const learningHistoryCollection = getCollectionByName("learningHistory");
    const learningHistory = await learningHistoryCollection.find({}).toArray();
    res.send(learningHistory);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/employees/:delegateId", async (req, res) => {
    try {
        const delegate_id = req.params.delegateId;
        const updatedData = req.body;
        const learningHistoryCollection = getCollectionByName("learningHistory");
        const result = await learningHistoryCollection.updateOne(
        { delegate_id: delegate_id },
        { $set: updatedData }
        );
        if (result.modifiedCount > 0) {
        res.send({ message: "employee details updated successfully" });
        } else {
        res.status(404).send({ message: "Employee not found" });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/employees/addEmployee", async (req, res) => {
  const { employee_id, delegate_id, first_name, last_name } = req.body;

  if (!employee_id || !delegate_id || !first_name || !last_name) {
    return res.status(400).send("Missing required fields");
  }
  try {
    const employeeIdsCollection = getCollectionByName("employeeIds");
    const learningHistoryCollection = getCollectionByName("learningHistory");

    // Insert employee into employeeIds collection
    await employeeIdsCollection.insertOne({
      employee_id,
      delegate_id,
    });

    // Insert learning history into learningHistory collection
    await learningHistoryCollection.insertOne({
      found: "true",
      delegate_id,
      first_name,
      last_name,
      records: [],
    });

    res.status(201).send("Employee added successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/learningHistory/:delegate_id", async (req, res) => {
  const { delegate_id } = req.params;
  const {
    course_title,
    course_code,
    country,
    training_provider,
    completed_on,
    valid_from,
    valid_until,
    status,
  } = req.body;

  if (
    !course_title ||
    !course_code ||
    !country ||
    !training_provider ||
    !completed_on ||
    !valid_from ||
    !valid_until ||
    !status
  ) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const learningHistoryCollection = getCollectionByName("learningHistory");

    // Update the learningHistory document with the new course
    await learningHistoryCollection.updateOne(
      { delegate_id },
      {
        $push: {
          records: {
            course_title,
            course_code,
            country,
            training_provider,
            completed_on,
            valid_from,
            valid_until,
            status,
          },
        },
      }
    );

    res.status(201).send("Course added successfully");
  } catch (error) {
    res.status(500).send("Error adding course");
  }
});

router.put(
  "/learningHistory/:delegate_id/:course_code",
  async (req, res) => {
    const { delegate_id, course_code } = req.params;
    const {
      course_title,
      country,
      training_provider,
      completed_on,
      valid_from,
      valid_until,
      status,
    } = req.body;

    if (
      !course_title ||
      !country ||
      !training_provider ||
      !completed_on ||
      !valid_from ||
      !valid_until ||
      !status
    ) {
      return res.status(400).send("Missing required fields");
    }

    try {
      const learningHistoryCollection = getCollectionByName("learningHistory");

      // Update the specific course record
      const result = await learningHistoryCollection.updateOne(
        { delegate_id, "records.course_code": course_code },
        {
          $set: {
            "records.$.course_title": course_title,
            "records.$.country": country,
            "records.$.training_provider": training_provider,
            "records.$.completed_on": completed_on,
            "records.$.valid_from": valid_from,
            "records.$.valid_until": valid_until,
            "records.$.status": status,
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).send("Course not found");
      }

      res.status(200).send("Course updated successfully");
    } catch (error) {
      res.status(500).send("Error updating course");
    }
  });

  router.delete('/employees/:delegateId', async (req, res) => {
    const { delegateId } = req.params;
    try {
      // Delete the employee
      const employeeIdsCollection = getCollectionByName("employeeIds");
      await employeeIdsCollection.findOneAndDelete({ delegate_id: delegateId });
  
      // Delete associated courses
      const learningHistoryCollection = getCollectionByName("learningHistory");
      await learningHistoryCollection.deleteMany({ delegate_id: delegateId });
  
      res.status(200).json({ message: 'Employee and associated courses deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting employee and courses' });
    }
  });

  router.delete('/learningHistory/:delegateId/:courseCode', async (req, res) => {
    const { courseCode, delegateId } = req.params;
    try {
        const learningHistoryCollection = getCollectionByName("learningHistory");
        const result = await learningHistoryCollection.updateOne(
            { delegate_id: delegateId },
            { $pull: { records: { course_code: courseCode } } }
          );
      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting course' });
    }
  });

module.exports = router;
