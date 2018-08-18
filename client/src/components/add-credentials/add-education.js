import React, { Component } from 'react'
import { Link, withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addEducation } from "../../actions/profileActions";

class AddEducation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      school: '',
      degree: '',
      fieldofstudy: '',
      from: '',
      to: '',
      current: false,
      description: '',
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCheck = this.onCheck.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  onCheck() {
    this.setState({
      current: !this.state.current,
    });
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onSubmit(event) {
    event.preventDefault();
    const eduData = {
      school: this.state.school,
      degree: this.state.degree,
      fieldofstudy: this.state.fieldofstudy,
      from: this.state.from,
      to: this.state.to,
      current: this.state.current,
      description: this.state.description,
    };
    this.props.addEducation(eduData, this.props.history);
  }

  render() {

    const { errors } = this.state;

    return (
      <div className="add-education">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">Go Back</Link>
              <h1 className="display-4 text-center">Add Education</h1>
              <p className="lead text-center">Add any school, bootcamp etc that you have attended</p>
              <small className="d-block pb-3">
                * denotes required fields
              </small>
              <form onSubmit={this.onSubmit}>
              <TextFieldGroup 
                placeholder="* School"
                name="school"
                value={this.state.school}
                onChange={this.onChange}
                error={errors.school}
              />
              <TextFieldGroup 
                placeholder="* Degree/Certification"
                name="degree"
                value={this.state.degree}
                onChange={this.onChange}
                error={errors.degree}
              />
              <TextFieldGroup 
                placeholder="* Field of Study"
                name="fieldofstudy"
                value={this.state.fieldofstudy}
                onChange={this.onChange}
                error={errors.fieldofstudy}
              />
              <h6>From Date</h6>
              <TextFieldGroup 
                type="date"
                name="from"
                value={this.state.from}
                onChange={this.onChange}
                error={errors.from}
              />
              <h6>To Date</h6>
              <TextFieldGroup 
                type="date"
                name="to"
                value={this.state.to}
                onChange={this.onChange}
                error={errors.to}
                disabled={this.state.current ? 'disabled': ''}
              />
              <div className="form-check mb-4">
              <input 
                type="checkbox" 
                className="form-check-input"
                name="current"
                value={this.state.current}
                checked={this.state.current}
                onChange={this.onCheck}
                id="current"
              />
              <label className="form-check-label" htmlFor="current">
                Ongoing
              </label>
              </div>
              <TextAreaFieldGroup 
                placeholder="Program Description"
                name="description"
                value={this.state.description}
                onChange={this.onChange}
                error={errors.description}
                info="Tell us about the programs you took"
              />
              <input type="submit" className="btn btn-info btn-block mt-4"/>
              </form>
            </div>
          </div>
        </div>        
      </div>
    )
  }
}

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors,
});

export default connect(mapStateToProps, { addEducation })(withRouter(AddEducation));