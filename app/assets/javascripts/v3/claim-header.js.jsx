var ClaimHeader = React.createClass({
  mixins: [
    Fynx.connect(globalStore, 'globalStore'),
  ],

  render: function() {
    var userIcon=(<Icon i="user"></Icon>);
    return (
      <Navbar fixedTop>
        <Nav>
          <NavItemLink to="claims" query={this.state.globalStore.get('claimsListQuery').toJS()}>
            <Icon xs i="list">List</Icon>
          </NavItemLink>
          <li>
            <p className="navbar-text">
              #{this.props.store.get('number')}: ${dollars(claimTotal(this.props.store))}
              {this.props.store.get('unsaved') && <span className="hidden-xs text-danger"> (unsaved)</span>}
            </p>
          </li>
          { this.props.submit ?
           <NavItem onClick={this.props.submit} className={this.props.store.get('unsaved') ? "text-danger" : ""}>
             <Icon i={"cog "+(this.state.globalStore.get('busy') ? "fa-spin" : "")}>
               Submit
             </Icon>
           </NavItem> :
           <li to="claims" className={this.props.store.get('unsaved') ? "text-danger" : ""}>
             <p className="navbar-text">
               <Icon i={"cog "+(this.state.globalStore.get('busy') ? "fa-spin" : "")}/>
             </p>
           </li>
           }
        </Nav>
        <UserDropdown/>
      </Navbar>
    );
  }
});

