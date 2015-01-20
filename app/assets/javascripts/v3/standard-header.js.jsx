var StandardHeader = React.createClass({
  render: function() {
    var userIcon=(<Icon i="user"></Icon>);
    return (
      <Navbar fixedTop>
        <Nav>
          <NavItemLink className="hidden-xs" to="landing">
            Mo-Billing
          </NavItemLink>
          <NavItemLink to="new_claim">
            <Icon i="plus">New</Icon>
          </NavItemLink>
          <NavItemLink to="claims" params={{filter:"drafts"}}>
            <Icon i="list">List</Icon>
          </NavItemLink>
        </Nav>
        <Nav right>
          <DropdownButton title={userIcon} navItem={true}>
            <li><Link to="profile"><Icon i="user">Profile</Icon></Link></li>
            <li><Link to="signout"><Icon i="sign-out">Sign Out</Icon></Link></li>
          </DropdownButton>
        </Nav>
      </Navbar>
    );
  }
});

