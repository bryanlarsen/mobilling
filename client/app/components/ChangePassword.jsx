import _ from 'underscore';
import ProfileHeader from '../components/ProfileHeader';
import ClaimInputGroup from '../components/ClaimInputGroup';
import ClaimFormGroup from '../components/ClaimFormGroup';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { changePassword } from '../actions/userActions';
import { pushState } from 'redux-router';

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_password: '',
      password: '',
      password_confirmation: '',
    }
  }

  handleSubmit(ev) {
    ev.preventDefault();
    this.props.dispatch(changePassword(this.state, () => {
      if (_.size(this.props.userStore.errors) === 0) {
        this.props.dispatch(pushState(null, '/profile/settings'));
      }
    }));
  }

  handleChange(ev) {
    var changes = {};
    changes[ev.target.name] = ev.target.value;
    this.setState(changes);
  }

  done() {
    //this.transitionTo('settings');
  }

  componentWillMount(ev) {
    //userActions.checkpoint();
    //userActions.saveComplete.listen(this.done);
  }

  componentWillUnmount(ev) {
    //userActions.restore();
  }

  render() {
    return <form className="form-horizontal">
      <ClaimInputGroup type="password" store={this.props.userStore} value={this.state.current_password} name="current_password" onChange={this.handleChange.bind(this)} />
      <ClaimInputGroup type="password" store={this.props.userStore} value={this.state.password} label="New Password" name="password" onChange={this.handleChange.bind(this)} />
      <ClaimInputGroup type="password" store={this.props.userStore} value={this.state.password_confirmation} label="New Password Confirmation" name="password_confirmation" onChange={this.handleChange.bind(this)} />

      <ClaimFormGroup label="">
        <input type="submit" className="btn btn-default btn-primary" onClick={this.handleSubmit.bind(this)} value="Submit" />
        &nbsp;
        <LinkContainer to="/profile/settings">
          <button className="btn btn-default">Cancel</button>
        </LinkContainer>
      </ClaimFormGroup>
    </form>;
  }
};

export default ChangePassword;
