const { Nav, NavDropdown, MenuItem } = require('react-bootstrap');
const { Link } = require('react-router');
const { LinkContainer } = require('react-router-bootstrap');
const Icon = require('./Icon');


module.exports = (props) => {
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
