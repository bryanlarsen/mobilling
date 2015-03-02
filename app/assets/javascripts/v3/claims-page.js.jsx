var ClaimsPage = React.createClass({
  mixins: [
  ],

  render: function() {

    return (
      <div className="body">
        <StandardHeader/>
        <div className="content-body container">
          <ClaimList filter={this.props.params.filter} />

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

