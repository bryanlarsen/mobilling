import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Icon from '../components/Icon';
import UserDropdown from '../components/UserDropdown';
import Notice from '../components/Notice';

export default (props) => {
  return (
    <Navbar fixedTop>
      <Nav>
        <LinkContainer to="/claims" query={props.globalStore.claimsListQuery}>
          <NavItem> <Icon i="list">List</Icon> </NavItem>
        </LinkContainer>
        <LinkContainer to="/profile/settings">
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
