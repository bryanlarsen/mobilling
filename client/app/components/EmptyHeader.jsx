import { Navbar, Nav, NavItem } from 'react-bootstrap';

import { Notice } from './index';

export default (props) => {
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
};

