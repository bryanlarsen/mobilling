import { Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Icon from '../components/Icon';


export default (props) => {
  const userIcon = <Icon i="user"/>;
  return (
    <Nav right>
      <NavDropdown id="userDropdown" title={userIcon}>
        <li>
          <Link to="/profile/settings">
            <Icon i="user">Profile</Icon>
          </Link>
        </li>
        <li>
          <a rel="nofollow" data-method="delete" href={window.ENV.API_ROOT+"session"}>
            <Icon i="sign-out">Sign Out</Icon>
          </a>
        </li>
        {!window.ENV.CORDOVA &&
         <li><a href="/admin"><Icon i="briefcase">Agent Dashboard</Icon></a></li>
         }
      </NavDropdown>
    </Nav>
  );
}
