import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { deletePost, likePost, unlikePost } from "../../actions/postActions";

class PostItem extends Component {

  constructor() {
    super();
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onLikeClick = this.onLikeClick.bind(this);
    this.onUnlikeClick = this.onUnlikeClick.bind(this);
    this.findUserLike = this.findUserLike.bind(this);
  }

  onDeleteClick(id) {
    this.props.deletePost(id);
  }

  onLikeClick(id) {
    this.props.likePost(id);
  }

  onUnlikeClick(id) {
    this.props.unlikePost(id);
  }

  findUserLike(likes) {
    const { auth } = this.props;
    if (likes.filter(like => like.user === auth.user.id).length > 0) {
      return true;
    }
    return false;
  }

  render() {

    const { post, auth, showactions } = this.props;

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              <img 
                className="rounded-circle d-none d-md-block" 
                src={post.avatar}
                alt="user avatar" />
            </a>
            <br />
            <p className="text-center">{post.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{post.text}</p>
            { showactions ? (
              <span>
              <button onClick={() => this.onLikeClick(post._id)} type="button" className="btn btn-light mr-1">
                <i className={classnames('fas fa-thumbs-up', {
                  'text-info': this.findUserLike(post.likes)
                })} />
                <span className="badge badge-light">{post.likes.length}</span>
              </button>
              <button onClick={() => this.onUnlikeClick(post._id)} type="button" className="btn btn-light mr-1">
                <i className="text-secondary fas fa-thumbs-down"></i>
              </button>
              <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                Comments
              </Link>
              {post.user === auth.user.id ? (
                <button type="button" onClick={() => this.onDeleteClick(post._id)} className="btn btn-danger mr-1">
                  <i className="fas fa-times" />
                </button>
              ): null}
            </span>
            ) : null }
          </div>
        </div>
      </div>
    )
  }
}

PostItem.defaultProps = {
  showactions: true,
}

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  showactions: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deletePost, likePost, unlikePost })(PostItem);