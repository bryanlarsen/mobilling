const EmptyHeader = require('./EmptyHeader');
const ClaimInputGroup = require('./ClaimInputGroup');
const ClaimFormGroup = require('./ClaimFormGroup');
const { setNotice, updateUserAttributes, userResponse } = require('../actions');
const { connect } = require('react-redux');
const { pushState } = require('redux-router');

@connect((state) => state)
class ForgotPasswordPage extends React.Component {
  submit(ev) {
    ev.preventDefault();
    var url = window.ENV.API_ROOT+'v1/request_password_reset.json';
    $.ajax({
      url: url,
      data: JSON.stringify({create_password_reset: {email: this.props.userStore.email}}),
      contentType: 'application/json',
      dataType: 'json',
      processData: false,
      type: 'POST',
      success: (data) => {
        if (data.notice) this.props.dispatch(setNotice(data.notice));
        this.props.dispatch(pushState('/login', '/login'));
      },
      error: (xhr, status, err) => {
        if (xhr.status === 403) {
          this.props.dispatch(pushState(null, '/login'));
        } else if (xhr.responseJSON) {
          this.props.dispatch(userResponse(xhr.responseJSON));
        } else {
          this.props.dispatch(unrecoverableError());
        }
      }
    });
  }

  render() {
    return (
      <div className="body">
        <EmptyHeader {...this.props}/>

        <div className="container with-bottom">
          <form ref="form" className="form-horizontal" onSubmit={this.submit.bind(this)}>

            <legend>Request Password Reset</legend>
            <ClaimInputGroup store={this.props.userStore} type="email" name="email" onChange={(ev) => this.props.dispatch(updateUserAttributes({email: ev.target.value}))}/>

            <ClaimFormGroup label="">
              <button type="submit" className="btn btn-default btn-primary">Submit</button>
            </ClaimFormGroup>
          </form>
        </div>
      </div>
    );
  }
};

module.exports = ForgotPasswordPage;
