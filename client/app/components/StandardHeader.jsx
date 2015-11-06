const { Navbar, Nav, NavItem } = require('react-bootstrap');
const { LinkContainer } = require('react-router-bootstrap');

const Icon = require('./Icon');
const UserDropdown = require('./UserDropdown');
const Notice = require('./Notice');

module.exports = (props) => {
  return (
    <div>
      <Navbar fixedTop>
        <Nav>
          {!window.ENV.CORDOVA && <NavItem href="http://billohip.ca" className="hidden-xs">BillOHIP</NavItem>}
          <LinkContainer to="/claims" query={props.globalStore.claimsListQuery}>
            <NavItem>
              <Icon i="list">List</Icon>
            </NavItem>
          </LinkContainer>
        </Nav>
        <UserDropdown {...props} />
      </Navbar>
      <Notice {...props} />
    </div>
  );
};

