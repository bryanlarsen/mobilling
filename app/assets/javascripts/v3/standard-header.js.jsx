var StandardHeader = React.createClass({
  render: function() {
    return (
      <Navbar fixedTop>
        <Nav>
          <NavItem href="http://mo-billing.ca" className="hidden-xs">
            Mo-Billing
          </NavItem>
          <NavItemLink to="claims" params={{filter:"drafts"}}>
            <Icon i="list">List</Icon>
          </NavItemLink>
        </Nav>
        <UserDropdown/>
      </Navbar>
    );
  }
});

