var EmptyHeader = React.createClass({
  mixins: [
    Fynx.connect(globalStore, 'globalStore'),
  ],

  render: function() {
    return (
      <div>
        <Navbar fixedTop>
          <Nav>
            {!window.ENV.CORDOVA && <NavItem href="http://mo-billing.ca" className="hidden-xs">Mo-Billing</NavItem>}
          </Nav>
        </Navbar>
        <Notice/>
      </div>
    );
  }
});

