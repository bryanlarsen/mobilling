var StandardHeader = React.createClass({
  mixins: [
    Fynx.connect(globalStore, 'globalStore'),
  ],

  render: function() {
    return (
    <div>
      <Navbar fixedTop>
        <Nav>
          <NavItem href={window.ENV.CORDOVA ? '#' : "http://mo-billing.ca"} className="hidden-xs">Mo-Billing</NavItem>
          <NavItemLink to="claims" query={this.state.globalStore.get('claimsListQuery').toJS()}>
            <Icon i="list">List</Icon>
          </NavItemLink>
        </Nav>
        <UserDropdown/>
      </Navbar>
      <Notice />
    </div>
    );
  }
});

