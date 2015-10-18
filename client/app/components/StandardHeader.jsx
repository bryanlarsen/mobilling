import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { Icon, UserDropdown, Notice } from '../components';

export default (props) => {
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

