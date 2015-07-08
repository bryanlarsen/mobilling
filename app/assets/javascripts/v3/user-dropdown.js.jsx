var UserDropdown = React.createClass({
  render: function() {
    var userIcon = <Icon i="user"/>;
    return (
      <ul className="nav navbar-nab navbar-right">
        <li>
          <DropdownButton title={userIcon} navItem={true} className="navbar-btn">
            <li><Link to="settings"><Icon i="user">Profile</Icon></Link></li>
            <li>
              <a rel="nofollow" data-method="delete" href={window.ENV.API_ROOT+"/session"}>
                <Icon i="sign-out">Sign Out</Icon>
              </a>
            </li>
            {!window.ENV.CORDOVA &&
              <li><a href="/admin"><Icon i="briefcase">Agent Dashboard</Icon></a></li>
             }
          </DropdownButton>
        </li>
      </ul>
    );
  }
});
