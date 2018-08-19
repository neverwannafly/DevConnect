import React, { Component } from 'react';
import Moment from "react-moment";

class ProfileCreds extends Component {

  render() {

    const { experience, education } = this.props;

    const expItems = experience.map(exp => (
      <li key={exp._id} className="list-group-item">
        <h4>{exp.company}</h4>
        <p className="text-muted">
          <Moment format="YYYY-MM-DD">{exp.format}</Moment> -&nbsp;
          { exp.current ? "Now" : <Moment format="YYYY-MM-DD">{exp.to}</Moment>}
        </p>
        <p><strong>Position:&nbsp;</strong>{exp.title}</p>
        <p>
          { exp.location === '' ? null : (<span><strong>Location:&nbsp;</strong>{exp.location}</span>) }
        </p>
        <p>
          { exp.description === '' ? null : (<span><strong>Description:&nbsp;</strong>{exp.description}</span>) }
        </p>
      </li>
    ));

    const eduItems = education.map(edu => (
      <li key={edu._id} className="list-group-item">
        <h4>{edu.school}</h4>
        <p className="text-muted">
          <Moment format="YYYY-MM-DD">{edu.format}</Moment> -&nbsp;
          { edu.current ? "Now" : <Moment format="YYYY-MM-DD">{edu.to}</Moment>}
        </p>
        <p><strong>Degree:&nbsp;</strong>{edu.degree}</p>
        <p><strong>Field of Study:&nbsp;</strong>{edu.fieldofstudy}</p>
        <p>
          { edu.description === '' ? null : (<span><strong>Description:&nbsp;</strong>{edu.description}</span>) }
        </p>
      </li>
    ));

    return (
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center text-info">Experience</h3>
          { expItems.length > 0 ? (
            <ul className="list-group">
              {expItems}
            </ul>
          ) : ( <p className="text-center">No Experience Listed</p> ) }
        </div>
        <div className="col-md-6">
          <h3 className="text-center text-info">Education</h3>
          { eduItems.length > 0 ? (
            <ul className="list-group">
              {eduItems}
            </ul>
          ) : ( <p className="text-center">No Education Listed</p> ) }
        </div>
      </div>
    )
  }
}

export default ProfileCreds;