var EmptyHeader = React.createClass({
  mixins: [
    Fynx.connect(globalStore, 'globalStore'),
  ],

  render: function() {
    return (
      <div>
        <Navbar fixedTop>
          <Nav>
            {!window.ENV.CORDOVA && <NavItem href="http://billohip.ca" className="hidden-xs">BillOHIP</NavItem>}
          </Nav>
        </Navbar>
        <Notice/>
      </div>
    );
  }
});

