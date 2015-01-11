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
          <NavItemLink to="claim_patient" id="new">
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
  mixins: [
    Fynx.connect(globalStore, 'globalStore'),
  ],

  render: function() {
    var userIcon=(<Icon i="user"></Icon>);
    return (
      <Navbar fixedTop>
        <Nav>
          <NavItemLink to="claims" filter="drafts">
            <Icon i="list">List</Icon>
          </NavItemLink>
          <NavItem>
            #{this.props.store.get('number')}: ${dollars(claimTotal(this.props.store))}
            {this.props.store.get('unsaved') && <span className="text-danger"> (unsaved)</span>}
          </NavItem>
          <NavItemLink to="claims" filter="drafts">
            <Icon i={"cog "+(this.state.globalStore.get('busy') ? "fa-spin" : "")}>Submit</Icon>
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

var PatientTab = React.createClass({
  render: function() {
    return (
      <ClaimPatient {...this.props}/>
    );
  }
});

var ClaimTab = React.createClass({
  admissionChanged: function(ev) {
    if (!this.props.store.get('first_seen_on')) {
      this.props.actions.updateFields([
        [['admission_on'], ev.target.value],
        [['first_seen_on'], ev.target.value]
      ]);
    } else {
      this.props.actions.updateFields([
        [['admission_on'], ev.target.value],
      ]);
    }
    this.props.actions.recalculateConsult();
  },

  render: function() {
    return (
      <div>
        <ClaimFormGroup label="Specialty">
          <ClaimInputWrapper {...this.props} name="specialty">
            <Select {...this.props} name="specialty" options={specialties} onChange={this.props.handleChange}/>
          </ClaimInputWrapper>
        </ClaimFormGroup>

        <ClaimHospital {...this.props} />
        <ClaimFormGroup label="Manual Review Required">
          <ClaimYesNo {...this.props} name="manual_review_indicator" />
        </ClaimFormGroup>

        {['family_medicine', 'internal_medicine', 'cardiology'].indexOf(this.props.store.get('specialty')) !== -1 && (
           <div>
             <ClaimInputGroup name="referring_physician" type='text' store={this.props.store} onChange={this.props.handleChange} />
             <ClaimDiagnoses {...this.props} />
             <ClaimFormGroup label="Most Responsible Physician">
               <ClaimYesNo {...this.props} name="most_responsible_physician" />
             </ClaimFormGroup>
             <ClaimAdmissionFirstLast {...this.props}/>
           </div>
         )
        }
      </div>
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
      <Route name="claim" path="/claim/:id" handler={ClaimPage}>
        <Route name="claim_patient" path="/claim/:id/patient" handler={PatientTab}/>
        <Route name="claim_claim" path="/claim/:id/claim" handler={ClaimTab}/>
        <Route name="claim_consult" path="/claim/:id/consult" handler={ConsultTab}/>
        <Route name="claim_items" path="/claim/:id/items" handler={ItemsTab}/>
        <Route name="claim_comments" path="/claim/:id/comments" handler={CommentsTab}/>
      </Route>
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
  mixins: [ ReactRouter.State, ReactRouter.Navigation,
    Fynx.connect(claimStore, 'store'),
  ],

  icon: {
    patient: 'user',
    claim: 'medkit',
    consult: 'user-md',
    items: 'list-alt',
    comments: 'comment-o'
  },

  tabs: function() {
    if (['internal_medicine', 'family_medicine', 'cardiology'].indexOf(this.state.store.getIn([this.props.params.id, 'specialty'])) !== -1) {
      return ['patient', 'claim', 'consult', 'items', 'comments'];
    } else {
      return ['patient', 'claim', 'items', 'comments'];
    }
  },

  checkClaim: function() {
    if (!this.state.store.get(this.props.params.id)) {
      claimLoad(this.props.params.id);
    }
  },

  componentDidMount: function(ev) {
    this.fixTab();
    this.checkClaim();
  },

  componentDidUpdate: function(ev) {
    this.fixTab();
    this.checkClaim();
  },

  getTab: function() {
    return this.tabs().indexOf(_.find(this.tabs(), function(tab) {
      return this.isActive('claim_'+tab);
    }, this));
  },

  fixTab: function() {
    this.$ = $(this.getDOMNode());
    this.$highlight = this.$.find('#highlight');

    var $el = this.$.find('#tab-nav > li:nth-child('+(this.getTab()+1)+')');
    if ($el.length) {
      this.$highlight.css({
        width: $el.css('width'),
        left: $el.position('left').left+'px'
      });
    }
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
    var tab = this.getTab();
    var dist = parseInt(ev.changedTouches[0].clientX - this.startx);
    if (dist < -SWIPE_DISTANCE) {
      tab = tab - 1;
      if (tab < 0) tab = this.tabs().length - 1;
    } else if (dist > SWIPE_DISTANCE) {
      tab = tab + 1;
      if (tab >= this.tabs().length) tab = 0;
    }
    this.transitionTo("claim_"+this.tabs()[tab], {id: this.props.params.id});
  },

  handleChange: function(ev) {
    claimActionsFor(this.props.params.id).updateFields([[[ev.target.name], ev.target.value]]);
  },

  render: function() {
    console.log('render');
    var store = this.state.store.get(this.props.params.id) || Immutable.fromJS({daily_details: [], diagnoses: []});
    var actions = claimActionsFor(this.props.params.id);
    return (
      <div className="body" onTouchStart={this.touchStart} onTouchMove={this.touchMove} onTouchEnd={this.touchEnd}>
        <ClaimHeader {...this.props} store={store} actions={actions}/>
        <div className="container with-bottom">
          <div className="form-horizontal">
            <RouteHandler {...this.props} store={store} actions={actions} handleChange={this.handleChange} silent />
          </div>
        </div>
        <Navbar fixedBottom>
          <ul id="tab-nav" className="nav navbar-nav nav-justified" style={{position: 'relative'}}>
            { _.map(this.tabs(), function(tab) {
               return <NavItemLink key={"claim_tab_"+tab} to={"claim_"+tab} id={this.props.params.id}>
                        <Icon i={this.icon[tab]} xs>{_.string.humanize(tab)}</Icon>
                      </NavItemLink>;
            }, this) }
            <div id="highlight"></div>
          </ul>
        </Navbar>
      </div>
    );
  }
});

var ClaimsPage = React.createClass({
  mixins: [
    Fynx.connect(claimListStore, 'store'),
  ],

  filters: {
    drafts: ["saved"],
    submitted: ["for_agent", "ready", "file_created", "uploaded", "acknowledged", "agent_attention"],
    rejected: ["doctor_attention"],
    done: ["done"]
  },

  render: function() {
    var claims = this.state.store.filter(function(claim) {
      return this.filters[this.props.params.filter].indexOf(claim.get('status')) !== -1;
    }, this);

    return (
      <div className="body">
        <StandardHeader/>
        <div className="content-body container">
          <ClaimList store={claims} filter={this.props.params.filter} />

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
    var claims = this.props.store.map(function(claim) {
      console.log('id', claim.get('id'));
      return (
        <Link key={"claim-"+claim.get('id')} to="claim_patient" params={{id: claim.get('id')}}><li className="list-group-item">Claim {claim.get('number')} {claim.get('status')}</li></Link>
      );
    }).toJS();
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

