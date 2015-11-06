const { Navbar, Nav, NavItem } = require('react-bootstrap');
const { LinkContainer } = require('react-router-bootstrap');

const Icon = require('./Icon');
const UserDropdown = require('./UserDropdown');
const Notice = require('./Notice');

module.exports = (props) => {
  return (
    <Navbar fixedTop>
      <Nav>
        <LinkContainer to="/claims" query={props.globalStore.claimsListQuery}>
          <NavItem> <Icon i="list">List</Icon> </NavItem>
        </LinkContainer>
        <LinkContainer to="profile">
          <NavItem>
            <Icon i={"cog "+(props.globalStore.busy ? "fa-spin" : "")}>&nbsp;Profile</Icon>
            {props.userStore.unsaved && <span className="text-danger"> (unsaved)</span>}
          </NavItem>
        </LinkContainer>
      </Nav>
      <UserDropdown {...props} />
      <Notice {...props} />
    </Navbar>
  );
}
