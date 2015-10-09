var StandardHeader = React.createClass({
  mixins: [
    Fynx.connect(globalStore, 'globalStore'),
  ],

  render: function() {
    return (
    <div>
      <Navbar fixedTop>
        <Nav>
          {!window.ENV.CORDOVA && <NavItem href="http://billohip.ca" className="hidden-xs">BillOHIP</NavItem>}
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

