var ProfileHeader = React.createClass({
  mixins: [
    Fynx.connect(globalStore, 'globalStore'),
  ],

  render: function() {
    return (
      <Navbar fixedTop>
        <Nav>
          <NavItemLink to="claims" query={this.state.globalStore.get('claimsListQuery').toJS()}>
            <Icon i="list">List</Icon>
          </NavItemLink>
          <NavItemLink to="profile">
            <Icon i={"cog "+(this.state.globalStore.get('busy') ? "fa-spin" : "")}>&nbsp;Profile</Icon>
            {this.props.store.get('unsaved') && <span className="text-danger"> (unsaved)</span>}
          </NavItemLink>
        </Nav>
        <UserDropdown/>
      </Navbar>
    );
  }
});

var Profile = React.createClass({
  mixins: [ ReactRouter.State, ReactRouter.Navigation,
    Fynx.connect(userStore, 'store'),
  ],

  render: function() {
    return (
      <div className="body">
        <ProfileHeader store={this.state.store}/>

        <div className="container with-bottom">
          <RouteHandler store={this.state.store}/>
        </div>
      </div>
    );
  }
});
