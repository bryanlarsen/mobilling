var ClaimsPage = React.createClass({
  mixins: [
    Fynx.connect(claimListStore, 'store'),
  ],

  filters: {
    drafts: ["saved"],
    submitted: ["for_agent", "ready", "file_created", "uploaded", "acknowledged", "agent_attention"],
    rejected: ["doctor_attention"],
    done: ["done"]
  },

  render: function() {
    var claims = this.state.store.filter(function(claim) {
      return this.filters[this.props.params.filter].indexOf(claim.get('status')) !== -1;
    }, this);

    return (
      <div className="body">
        <StandardHeader/>
        <div className="content-body container">
          <ClaimList store={claims} params={{filter: this.props.params.filter}} />

          <div className="bottom-bar">
            <div className="pull-right">
              <ButtonLink to="new_claim">
                <Icon i="plus">New Claim</Icon>
              </ButtonLink>
            </div>
          </div>
        </div>
        <Navbar fixedBottom>
          <ul className="nav navbar-nav nav-justified">
            <NavItemLink to="claims" params={{filter:"drafts"}}>
              Drafts
            </NavItemLink>
            <NavItemLink to="claims" params={{filter:"submitted"}}>
              Submitted
            </NavItemLink>
            <NavItemLink to="claims" params={{filter:"rejected"}}>
              Rejected
            </NavItemLink>
            <NavItemLink to="claims" params={{filter:"done"}}>
              Done
            </NavItemLink>
          </ul>
        </Navbar>
      </div>
    );
  }
});

