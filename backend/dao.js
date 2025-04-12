// functions that access the JSON file go here data.js file
const { data } = require("./data.js") // get the json data here

class ResourcesDAO {
    static async getCategories() {
        try {     
            return {
                categories: Object.keys(data)
            };
        } catch (error) {
            throw new Error("Error occurred in system.")
        }
    }
}

module.exports = ResourcesDAO;