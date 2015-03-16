var UserDropdown = React.createClass({
  render: function() {
    var userIcon = <Icon i="user"/>;
    return (
      <ul className="nav navbar-nab navbar-right">
        <li>
          <DropdownButton title={userIcon} navItem={true} className="navbar-btn">
            <li><Link to="settings"><Icon i="user">Profile</Icon></Link></li>
            <li>
              <a rel="nofollow" data-method="delete" href="/session">
                <Icon i="sign-out">Sign Out</Icon>
              </a>
            </li>
            <li><a href="/admin"><Icon i="briefcase">Agent Dashboard</Icon></a></li>
          </DropdownButton>
        </li>
      </ul>
    );
  }
});
