import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { connect } from "react-redux";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";
const Register = ({ register }) => {
  const alert = useAlert();

  const [formData, setFormData] = useState({
    name: null,
    email: null,
    password: null,
    password2: null
  });
  const { name, email, password, password2 } = formData;
  const onChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    if (password !== password2) {
      alert.error("Password does not match !");
    } else {
      register(name, email, password);
    }
  };

  return (
    <Fragment>
      <section className="container">
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Create Your Account
        </p>
        <form className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              value={name}
              name="name"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              name="email"
              onChange={onChange}
            />
            <small className="form-text">
              This site uses Gravatar so if you want a profile image, use a
              Gravatar email
            </small>
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="password2"
              onChange={onChange}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </section>
    </Fragment>
  );
};
Register.propTypes = {
  register: PropTypes.func.isRequired
};
export default connect(null, { register })(Register);
