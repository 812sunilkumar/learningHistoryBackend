const express = require('express');

const cors = require('cors');
const { initializeCollections } = require('./collections');
const employeeRoutes = require("./routes/employeeRoutes");
const learningHistoryRoutes = require("./routes/learningHistoryRoutes");

const app = express();
app.use(cors());
app.use(express.json());



const PORT = process.env.PORT || 5000;

initializeCollections().then(() => {
    app.use("/api/employees", employeeRoutes);
    app.use("/api/learninghistory", learningHistoryRoutes);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize collections:', err);
});