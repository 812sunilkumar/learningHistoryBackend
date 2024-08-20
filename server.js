const express = require('express');

const cors = require('cors');
const routes = require('./routes');
const { initializeCollections } = require('./collections');
const employeesRouter = require("./routes/employees");
const learningHistoryRouter = require("./routes/learningHistory");

const app = express();
app.use(cors());
app.use(express.json());



const PORT = process.env.PORT || 5000;

initializeCollections().then(() => {
    app.use('/api', routes);
    // app.use("/api/employees", employeesRouter);
    // app.use("/api/learninghistory", learningHistoryRouter);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize collections:', err);
});