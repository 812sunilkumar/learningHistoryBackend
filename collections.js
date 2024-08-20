const { getCollection } = require('./db');

const collections = {
    employeeIds: null,
    learningHistory: null,
};

async function initializeCollections() {
    try {
        collections.employeeIds = await getCollection('employeeIds');
        collections.learningHistory = await getCollection('learningHistory');
    } catch (error) {
        console.error('Error initializing collections:', error);
        process.exit(1);
    }
}

function getCollectionByName(name) {
    return collections[name];
}

module.exports = {
    initializeCollections,
    getCollectionByName,
};
