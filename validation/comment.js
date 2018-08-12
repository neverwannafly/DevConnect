const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateCommentInput(data) {

    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : '';

    if (!Validator.isLength(data.text, {
            min: 1,
            max: 120
        })) {
        errors.text = 'Comment must be b/w 1 and 120 characters!'
    }

    if (Validator.isEmpty(data.text)) {
        errors.text = 'Text Field is required!';
    }

    return {
        errors: errors,
        isValid: isEmpty(errors)
    };
}