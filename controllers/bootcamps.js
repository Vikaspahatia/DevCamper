const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

// @desc     Get all bootcamps
// @route    GET api/v1/bootcamps
// @access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
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
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

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

    // Executing query
    const bootcamps = await query;

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});

// @desc     Get single bootcamp
// @route    GET api/v1/bootcamps/:id
// @access   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.findById(req.params.id);
    if (!bootcamps) {
        return next(new ErrorResponse(`Bootcamp not found ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: bootcamps
    });
});

// @desc     Create new bootcamp
// @route    POST api/v1/bootcamps
// @access   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    });

});

// @desc     Update bootcamp
// @route    PUT  api/v1/bootcamps/:id
// @access   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: bootcamp
    })
});

// @desc     Delete bootcamp
// @route    DELETE  api/v1/bootcamps/:id
// @access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found ${req.params.id}`, 404)
        );
    }

    bootcamp.remove();

    res.status(200).json({ success: true, data: {} });
});