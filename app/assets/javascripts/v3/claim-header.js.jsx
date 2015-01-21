var ClaimHeader = React.createClass({
  mixins: [
    Fynx.connect(globalStore, 'globalStore'),
  ],

  render: function() {
    var userIcon=(<Icon i="user"></Icon>);
    return (
      <Navbar fixedTop>
        <Nav>
          <NavItemLink to="claims" params={{filter:"drafts"}}>
            <Icon i="list">List</Icon>
          </NavItemLink>
          <NavItem>
            #{this.props.store.get('number')}: ${dollars(claimTotal(this.props.store))}
            {this.props.store.get('unsaved') && <span className="text-danger"> (unsaved)</span>}
          </NavItem>
          <NavItemLink to="claims" params={{filter:"drafts"}}>
            <Icon i={"cog "+(this.state.globalStore.get('busy') ? "fa-spin" : "")}>Submit</Icon>
          </NavItemLink>
        </Nav>
        <UserDropdown/>
      </Navbar>
    );
  }
});

