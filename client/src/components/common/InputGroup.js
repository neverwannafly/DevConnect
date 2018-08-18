import React from 'react'
import classnames from "classnames";
import PropTypes from 'prop-types';

const InputGroup = ({
    name, 
    placeholder,
    value,
    error,
    icon,
    type,
    onChange,
    spacing,
}) => {
  return (
    <div className="input-group mb-3">
        <div className="input group-prepend">
            <span className="input-group-text">
                <i className={icon} />
            </span>
        </div>
            { spacing===1 ? <span>&nbsp;</span> : <span>&nbsp;&nbsp;</span> }
        <input
            type={type}
            className={classnames('form-control form-control-sm', {
                'is-invalid': error
            })}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
        />
        {error && (<div className='invalid-feedback'>{error}</div>)}
    </div>
  )
}

InputGroup.propTypes = {
    name: PropTypes.string.isRequired,
    placeholer: PropTypes.string,
    value: PropTypes.string.isRequired,
    icon: PropTypes.string,
    type: PropTypes.string.isRequired,
    error: PropTypes.string,
    spacing: PropTypes.number,
    onChange: PropTypes.func.isRequired,
}

InputGroup.defaultProps = {
    type: 'text',
    spacing: 1,
}

export default InputGroup;