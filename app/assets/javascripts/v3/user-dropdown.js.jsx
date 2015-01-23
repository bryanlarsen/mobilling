var UserDropdown = React.createClass({
  render: function() {
    var userIcon = <Icon i="user"/>;
    return (
      <Nav right>
        <DropdownButton title={userIcon} navItem={true}>
          <li><Link to="settings"><Icon i="user">Profile</Icon></Link></li>
          <li>
            <a rel="nofollow" data-method="delete" href="/session">
              <Icon i="sign-out">Sign Out</Icon>
            </a>
          </li>
          <li><a href="/admin"><Icon i="briefcase">Agent Dashboard</Icon></a></li>
        </DropdownButton>
      </Nav>
    );
  }
});
