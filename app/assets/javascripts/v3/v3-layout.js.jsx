var Route = ReactRouter.Route;
var NotFoundRoute = ReactRouter.NotFoundRoute;
var DefaultRoute = ReactRouter.DefaultRoute;
var Link = ReactRouter.Link;
var RouteHandler = ReactRouter.RouteHandler;
var Redirect = ReactRouter.Redirect;

var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;

var Icon = React.createClass({
  render: function() {
    return (
      <span>
        <i className={"fa fa-"+this.props.i+(this.props.xsi?" hidden-xs":"")} />
        <span className={this.props.xs ? "hidden-xs" : ""}> {this.props.children}</span>
      </span>
    );
  }
});

React.initializeTouchEvents(true);

var StandardHeader = React.createClass({
  render: function() {
    var userIcon=(<Icon i="user"></Icon>);
    return (
      <Navbar fixedTop>
        <Nav>
          <NavItemLink className="hidden-xs" to="landing">
            Mo-Billing
          </NavItemLink>
          <NavItemLink to="claim" id="new">
            <Icon i="plus">New</Icon>
          </NavItemLink>
          <NavItemLink to="claims" filter="drafts">
            <Icon i="list">List</Icon>
          </NavItemLink>
        </Nav>
        <Nav right>
          <DropdownButton title={userIcon} navItem={true}>
            <li><Link to="profile"><Icon i="user">Profile</Icon></Link></li>
            <li><Link to="signout"><Icon i="sign-out">Sign Out</Icon></Link></li>
          </DropdownButton>
        </Nav>
      </Navbar>
    );
  }
});

var ClaimHeader = React.createClass({
  render: function() {
    var userIcon=(<Icon i="user"></Icon>);
    return (
      <Navbar fixedTop>
        <Nav>
          <NavItemLink className="hidden-xs" to="landing">
            Mo-Billing
          </NavItemLink>
          <NavItemLink to="claims" filter="drafts">
            <Icon i="cog fa-spin">Submit</Icon>
          </NavItemLink>
          <NavItemLink to="claims" filter="drafts">
            <Icon i="list">List</Icon>
          </NavItemLink>
        </Nav>
        <Nav right>
          <DropdownButton title={userIcon} navItem={true}>
            <li><Link to="profile"><Icon i="user">Profile</Icon></Link></li>
            <li><Link to="signout"><Icon i="sign-out">Sign Out</Icon></Link></li>
          </DropdownButton>
        </Nav>
      </Navbar>
    );
  }
});

var App = React.createClass({
  render: function() {
    return (
      <RouteHandler {...this.props}/>
    );
  }
});


$(document).ready(function() {
  var routes = (
    <Route name="app" path="/" handler={App}>
      <Route name="claims" path="/claims/:filter" handler={ClaimsPage}/>
      <Route name="profile" handler={Profile}/>
      <Route name="landing" handler={Landing}/>
      <Route name="signout" handler={Landing}/>
      <Route name="claim" path="/claim/:id" handler={ClaimPage}/>
      <Redirect from="/" to="/claims/drafts"/>
    </Route>
  );
  ReactRouter.run(routes, function(Handler, state) {
    React.render(<Handler params={state.params}/>, document.body);
  });
});

var Drafts = React.createClass({
  render: function() {
    return (
      <div>Drafts!</div>
    );
  }
});

var Landing = React.createClass({
  render: function() {
    return (
      <div className="body">
        <StandardHeader/>
        <div className="page-header">
          <h1>Mo-Billing</h1>
        </div>
      </div>
    );
  }
});

var SWIPE_DISTANCE=60;

var ClaimPage = React.createClass({
  tabs: ['profile', 'claim', 'consult', 'items', 'comments'],

  getInitialState: function() {
    return {
      tab: 0,
    };
  },

  clickTab: function(ev) {
    ev.preventDefault();
    var tab= $(ev.target).parents("li").attr('name');
    tab = this.tabs.indexOf(tab);
    this.setState({tab: tab});
    this.gotoTab(tab);
    console.log(tab);
//    this.refs.swipe.swipe.slide([].indexOf(tab));
  },

  componentDidMount: function(ev) {
    this.$ = $(this.getDOMNode());
    this.$highlight = this.$.find('#highlight');
    this.gotoTab(this.state.tab);
  },

  touchStart: function(ev) {
    this.touchLeft = parseInt(this.$highlight.css('left'));
    this.touchWidth = this.$highlight.width();
    this.startx = parseInt(ev.changedTouches[0].clientX);
  },

  touchMove: function(ev) {
    var dist = parseInt(ev.changedTouches[0].clientX - this.startx);
    if (dist < -SWIPE_DISTANCE) dist = -SWIPE_DISTANCE;
    if (dist > SWIPE_DISTANCE) dist = SWIPE_DISTANCE;
    dist = (dist/SWIPE_DISTANCE)*this.touchWidth;
    this.$highlight.css('left', this.touchLeft + dist);
  },

  touchEnd: function(ev) {
    var tab = this.state.tab;
    var dist = parseInt(ev.changedTouches[0].clientX - this.startx);
    if (dist < -SWIPE_DISTANCE) {
      tab = tab - 1;
      if (tab < 0) tab = this.tabs.length - 1;
    } else if (dist > SWIPE_DISTANCE) {
      tab = tab + 1;
      if (tab >= this.tabs.length) tab = 0;
    }
    this.setState({tab: tab});
    this.gotoTab(tab);
  },

  gotoTab: function(tab) {
    var $el = this.$.find('#tab-nav > li:nth-child('+(tab+1)+')');
    this.$highlight.css({
      width: $el.css('width'),
      left: $el.position('left').left+'px'
    });
  },

  render: function() {
    var tab = this.tabs[this.state.tab]
    return (
      <div className="body" onTouchStart={this.touchStart} onTouchMove={this.touchMove} onTouchEnd={this.touchEnd}>
        <ClaimHeader/>
        <div className="container with-bottom">
          <h1>{tab}</h1>
            {_.times(10*this.state.tab, function(i) {
              return <div key={'fill-'+i}>Fill {i}</div>;
             })
            }
        </div>
        <Navbar fixedBottom>
          <ul id="tab-nav" className="nav navbar-nav nav-justified" style={{position: 'relative'}}>
            <NavItem name="profile" onClick={this.clickTab}>
              <Icon i="user" xs>Patient</Icon>
            </NavItem>
            <NavItem name="claim" onClick={this.clickTab}>
              <Icon i="medkit" xs>Claim</Icon>
            </NavItem>
            <NavItem name="consult" onClick={this.clickTab}>
              <Icon i="user-md" xs>Consult</Icon>
            </NavItem>
            <NavItem name="items" onClick={this.clickTab}>
              <Icon i="list-alt" xs>Items</Icon>
            </NavItem>
            <NavItem name="comments" onClick={this.clickTab}>
              <Icon i="comment-o" xs>comments</Icon>
            </NavItem>
            <div id="highlight"></div>
          </ul>
        </Navbar>
      </div>
    );
  }
});

var ClaimsPage = React.createClass({
  render: function() {
    return (
      <div className="body">
        <StandardHeader/>
        <div className="content-body container">
          <ClaimList filter={this.props.params.filter} />

          <div className="bottom-bar">
            <div className="pull-right">
              <ButtonLink to="claim" id="new">
                <Icon i="plus">New Claim</Icon>
              </ButtonLink>
            </div>
          </div>
        </div>
        <Navbar fixedBottom>
          <ul className="nav navbar-nav nav-justified">
            <NavItemLink to="claims" filter="drafts">
              Drafts
            </NavItemLink>
            <NavItemLink to="claims" filter="submitted">
              Submitted
            </NavItemLink>
            <NavItemLink to="claims" filter="rejected">
              Rejected
            </NavItemLink>
            <NavItemLink to="claims" filter="done">
              Done
            </NavItemLink>
          </ul>
        </Navbar>
      </div>
    );
  }
});

var ClaimList = React.createClass({
  render: function() {
    var claims = _.times(this.props.filter==='drafts' ? 100 : 1, function(claim) {
      return (
        <li key={"claim-"+claim} className="list-group-item">Claim {claim}</li>
      );
    });
    return (
      <ul className="list-group with-bottom">
        {claims}
      </ul>
    );
  }
});

var Profile = React.createClass({
  render: function() {
    return (
      <div className="body">
        <StandardHeader/>
        <div className="container">
          <div className="page-header">
            <h1>Header</h1>
          </div>
          <pre>
            {JSON.stringify(current_user, null, '  ')}
          </pre>
        </div>
      </div>
    );
  }
});

