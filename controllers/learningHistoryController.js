const { getCollectionByName } = require("../collections");

const getLearningHistory = async (req, res) => {
  try {
    const learningHistoryCollection = getCollectionByName("learningHistory");
    const learningHistory = await learningHistoryCollection.find({}).toArray();
    res.send(learningHistory);
  } catch (error) {
    res.status(500).send(error);
  }
};

const addCourse = async (req, res) => {
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
};

const updateCourse = async (req, res) => {
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
};

const deleteCourse = async (req, res) => {
  const { delegateId, courseCode } = req.params;
  try {
    const learningHistoryCollection = getCollectionByName("learningHistory");
    await learningHistoryCollection.updateOne(
      { delegate_id: delegateId },
      { $pull: { records: { course_code: courseCode } } }
    );

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting course' });
  }
};

const getCourseCode = async (req, res) => {
    try {
        // Assuming your employee data is stored in a collection named 'employees'
        const learningHistoryCollection = getCollectionByName("learningHistory");
        const learningHistory = await learningHistoryCollection.find({}).toArray();
    
        // Extract all course codes from learning history
        const courseCodes = learningHistory.flatMap(employee => 
          employee.records.map(record => record.course_code)
        );
    
        // Get unique course codes
        const uniqueCourseCodes = [...new Set(courseCodes)];
    
        res.json(uniqueCourseCodes);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch course codes' });
      }
}

module.exports = {
  getLearningHistory,
  addCourse,
  updateCourse,
  deleteCourse,
  getCourseCode,
};
