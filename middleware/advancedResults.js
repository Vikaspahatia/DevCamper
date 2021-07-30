const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    // Copy of req.query in reqQuery
    const reqQuery = { ...req.query };

    //Fields to exclude
    const removeFields = ['select', 'sort']; // ye dono chize dB m search nhi hogi

    // Loop over removeFields and delete from the reqQuery
    removeFields.forEach(param => delete reqQuery[param]);


    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators like ($gt,$gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = model.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');  // split, splits the array in two words and join, makes em a string again
        query = query.select(fields);
    } else {
        query = query.sort('-createdAt');
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }

    if (populate) {
        query = query.populate(populate);
    }
    // Executing query
    const results = await query;



    res.advancedResults = {
        success: true,
        count: results.length,
        //pagination,
        data: results
    }


}

module.exports = advancedResults;