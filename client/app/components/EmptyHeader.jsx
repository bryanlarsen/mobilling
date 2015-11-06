const { Navbar, Nav, NavItem } = require('react-bootstrap');
const { Notice } = require('./index');

module.exports = (props) => {
  return (
    <div>
      <Navbar fixedTop>
        <Nav>
          {!window.ENV.CORDOVA && <NavItem href="http://billohip.ca" className="hidden-xs">BillOHIP</NavItem>}
        </Nav>
      </Navbar>
      <Notice {...props} />
    </div>
  );
};

