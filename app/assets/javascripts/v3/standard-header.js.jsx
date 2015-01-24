var StandardHeader = React.createClass({
  render: function() {
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
        <UserDropdown/>
      </Navbar>
    );
  }
});
