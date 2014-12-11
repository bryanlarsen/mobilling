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
      <Route name="profile" handler={Lorem}/>
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

var Lorem = React.createClass({
  render: function() {
    return (
      <div className="body">
        <StandardHeader/>
        <div className="container">
          <div className="page-header">
            <h1>Header</h1>
          </div>
          <p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum venenatis commodo purus vel aliquet. Nulla facilisi. Suspendisse vulputate vel nulla non viverra. Nulla facilisi. Curabitur sagittis, sem dapibus vehicula tincidunt, elit sapien varius neque, ut semper orci dui vel nunc. Proin sit amet sem at massa blandit porttitor eget eu velit. Morbi convallis risus ipsum, eu tempus felis dapibus non. Cras orci nibh, mattis id egestas ac, mattis et neque. Proin facilisis sed purus vitae convallis. Nullam aliquet tortor sapien, non pulvinar dui lacinia semper. Nullam posuere, ex vitae tempus suscipit, erat quam rhoncus est, laoreet pharetra mauris nulla at elit. Pellentesque volutpat congue justo, quis suscipit quam sagittis ut. Sed fermentum a nisl ut tempor. Suspendisse interdum dolor ligula, ac malesuada lectus feugiat vel. Aenean diam magna, pharetra lacinia augue tincidunt, vehicula feugiat purus.
          </p><p>
Cras quam nunc, sollicitudin vitae condimentum non, pellentesque a mi. Nullam tincidunt accumsan est eget viverra. Donec felis sem, fermentum ut vehicula vitae, euismod id nulla. Vivamus ac augue dictum, cursus odio in, tempor arcu. Integer fermentum lorem justo, pellentesque rutrum arcu fermentum sed. Curabitur urna ante, suscipit ut iaculis et, blandit eu neque. Quisque et dictum quam. Integer elit sem, sagittis non ultricies sollicitudin, rutrum sit amet purus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque ut blandit tortor. Cras luctus, neque et congue lobortis, purus lorem eleifend libero, sed laoreet diam libero a mi. Fusce tincidunt erat feugiat justo cursus ultrices. Maecenas quis facilisis dolor. Nam et elementum mauris.
          </p><p>

Proin lacus neque, convallis sed blandit vestibulum, condimentum eget purus. Nullam dolor elit, aliquet at risus a, rhoncus aliquet dolor. Maecenas dignissim elit vel ex eleifend, nec fermentum ex suscipit. Maecenas commodo efficitur lectus, sed convallis nibh feugiat et. Vivamus libero lacus, consectetur non commodo quis, dictum pretium nibh. Maecenas pellentesque id enim sed iaculis. Fusce at rutrum purus, nec bibendum massa. Pellentesque sapien eros, tincidunt a ipsum ut, convallis scelerisque elit. Aenean a ante quis enim sollicitudin luctus. Nulla facilisi. Aliquam vel accumsan ante. Pellentesque sit amet consectetur sem, at accumsan elit. Sed pharetra faucibus augue, ac suscipit est consectetur nec. Aenean eu semper neque, quis porttitor sem. Cras et quam porttitor, sagittis ligula blandit, feugiat turpis. Pellentesque ac sapien porta, pulvinar orci at, rhoncus dolor.
          </p><p>

Sed tincidunt non libero eu fringilla. Suspendisse potenti. Donec laoreet fermentum nibh nec vehicula. Praesent pulvinar massa dolor, sit amet mollis nunc venenatis ut. Sed mi nibh, dictum quis turpis eu, iaculis interdum massa. Fusce vulputate mauris ut porttitor facilisis. Sed mi orci, tristique non vestibulum at, fermentum ac tortor. Fusce eu lorem quis odio viverra congue. Curabitur ac dignissim nisi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent eu dui lacus.
          </p><p>

Curabitur et suscipit dolor. Proin pulvinar nec felis nec bibendum. Etiam dolor mauris, ornare placerat ipsum quis, scelerisque placerat erat. Curabitur vel dolor eu neque lacinia accumsan. Fusce vel lectus vitae neque commodo tincidunt. Phasellus auctor mattis nisl, quis dictum elit ullamcorper id. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed semper lectus ut tellus blandit egestas. Nulla porta pharetra ipsum, id consectetur felis posuere id. Ut mattis vulputate nulla at efficitur. Vestibulum tristique aliquet finibus. Proin tempus interdum arcu nec auctor. Vivamus vel scelerisque dolor. Proin euismod nunc vitae iaculis placerat. Phasellus in eleifend ex.
          </p><p>

Proin at vehicula purus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam quis nibh ut mauris blandit sagittis. Integer ac ex et metus hendrerit efficitur. Donec vel egestas dui, eu porta orci. Sed egestas ornare elit, vitae tristique libero iaculis aliquam. Pellentesque lacus nisl, elementum ac volutpat nec, rhoncus nec elit. Curabitur egestas mollis ipsum a vulputate.
          </p><p>

Vestibulum condimentum non sapien eget fermentum. Cras non varius magna. Nunc sed lectus euismod, vulputate leo ac, consectetur lacus. Maecenas dolor mi, pulvinar sed risus nec, iaculis dictum justo. Maecenas vestibulum mi ac dictum faucibus. Suspendisse accumsan, est et luctus rhoncus, lorem magna euismod nisi, quis elementum velit augue vitae leo. Suspendisse potenti. Phasellus mattis ullamcorper turpis vel consequat. Pellentesque dictum ornare lectus sed porta. Curabitur rutrum semper metus, at tempor leo dictum at. Duis a ipsum tempus, maximus quam ultricies, volutpat nisi. Donec ut placerat libero, vel finibus tellus. Vivamus non mattis purus.
          </p><p>

Donec luctus ac leo eleifend ullamcorper. Fusce maximus ut est nec accumsan. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras dignissim quam in enim feugiat euismod. Curabitur elementum dolor justo, ut malesuada leo pretium in. Nullam ac eros condimentum, pretium purus a, euismod orci. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
          </p><p>

Morbi tempus mi eleifend risus ultrices aliquet. Phasellus sed dolor purus. Ut convallis fermentum iaculis. Sed est sem, scelerisque malesuada lacinia eu, mattis et turpis. Mauris malesuada eros et eleifend sollicitudin. Quisque semper velit orci, eu molestie felis mollis placerat. Nulla facilisi. Nunc sit amet pharetra purus. Mauris tristique, nulla ut dignissim dignissim, massa magna finibus magna, nec semper eros turpis sit amet neque. Suspendisse ut sapien nec felis gravida luctus. Nulla porttitor faucibus pulvinar. Mauris convallis quam at odio porta facilisis. Aenean in ex interdum, dignissim libero vel, suscipit erat. Nullam vel lorem ac lectus feugiat aliquet.
          </p><p>

Praesent ut cursus lacus, eget cursus massa. Cras faucibus urna lectus, vel lobortis magna tincidunt a. Proin suscipit dapibus dolor vel efficitur. Duis a volutpat massa, eget aliquet massa. Integer ut ligula in risus feugiat pulvinar a sit amet nibh. Etiam quis euismod nisl. Curabitur in fermentum sapien. Cras non ipsum vulputate, rutrum ex ac, cursus augue. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc gravida arcu ut neque blandit, ac mollis erat egestas. Mauris dignissim nulla sit amet pharetra posuere. Fusce ac diam varius, euismod neque nec, fermentum dui. Donec rhoncus vulputate ipsum, ut pulvinar lectus gravida sodales. Ut dui augue, dapibus vel ante sed, molestie tempus quam. Sed volutpat iaculis congue.
          </p><p>

Praesent placerat nunc eget gravida vestibulum. Nullam dictum sit amet tortor a tristique. Morbi ornare eros nibh. Nunc nec interdum odio, at imperdiet est. Aliquam turpis libero, ultrices id tristique ut, sodales vel tortor. Mauris turpis mi, interdum ac fringilla non, maximus quis dolor. Sed scelerisque vulputate nisl ac dignissim. Vivamus semper, quam non varius maximus, massa tortor vehicula sapien, ut pretium eros purus a massa. Sed tincidunt porttitor risus ac consequat. Duis vitae risus accumsan, dignissim magna et, ultricies turpis. Praesent interdum malesuada magna et posuere.
          </p><p>

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In quis nulla id diam rhoncus auctor. Quisque lectus orci, hendrerit vel nunc quis, ullamcorper blandit sapien. Cras mauris odio, tincidunt a mauris nec, gravida feugiat metus. Suspendisse sit amet sem neque. Duis congue eu quam at rutrum. Cras maximus nulla sapien, porttitor sollicitudin felis mollis ac. Integer congue nunc arcu, ut auctor massa ultrices ac. Sed vitae placerat risus, a condimentum neque. Aliquam pulvinar felis sed molestie feugiat.
          </p><p>

Nullam neque massa, semper scelerisque condimentum fringilla, cursus vitae risus. Curabitur sit amet faucibus tellus, non volutpat purus. Sed in iaculis nulla. Donec aliquam est ante, eget vestibulum neque pellentesque et. Maecenas sollicitudin tincidunt eros in accumsan. Nunc fermentum ex orci, et pretium nulla rutrum eget. Ut eros diam, molestie eget congue sodales, suscipit non massa. Praesent fringilla, leo ut venenatis accumsan, urna urna tincidunt neque, id interdum lacus velit quis dui. Nunc arcu tortor, sodales at finibus vitae, dapibus ut nibh. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque mauris lectus, bibendum eu quam venenatis, aliquam laoreet lectus. Aliquam auctor dictum nisi quis cursus. Cras non lacinia quam. Vivamus posuere venenatis bibendum. In rutrum quis neque eu hendrerit.
          </p><p>

Vestibulum dapibus vitae risus vel auctor. Pellentesque blandit est sed elit maximus, nec pretium eros euismod. Donec lacinia auctor nibh, a rutrum massa dapibus eu. Aenean augue risus, efficitur non molestie id, dapibus vel mi. Morbi quis placerat libero. Phasellus finibus ligula eget porttitor dignissim. Maecenas elementum felis vitae arcu tincidunt tempor. Maecenas sed libero bibendum, efficitur nisl a, ultricies mi.
          </p><p>

Quisque elementum magna cursus dui maximus, quis aliquam nibh ultricies. Donec in viverra risus. Sed tristique ultrices tortor, vel scelerisque massa finibus quis. Nam efficitur a tortor in molestie. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nisl metus, viverra eu porttitor lacinia, fringilla sed mauris. Nulla eget vulputate leo. Morbi vitae nunc interdum, rutrum nisi et, scelerisque lectus. Nulla vitae velit vulputate, tristique nibh sit amet, consequat risus. Curabitur justo ante, dictum eu ante id, hendrerit scelerisque nulla. Donec blandit justo id orci auctor convallis.
          </p><p>

Integer commodo luctus risus sit amet lobortis. Pellentesque rutrum nisl et ante blandit, et blandit lorem suscipit. Suspendisse et mi quis ligula porttitor viverra. Ut euismod turpis id eleifend aliquet. Curabitur pretium dignissim elit vitae auctor. Cras sodales lorem non nibh ultrices, vitae sodales ligula malesuada. Vestibulum suscipit quam metus, vel laoreet massa iaculis at. Mauris consectetur lacinia lorem sed dignissim. Morbi tincidunt ut arcu ut venenatis. Curabitur nulla ex, lacinia vel mollis semper, gravida ac augue. Aenean et lorem sagittis, auctor nisl sed, tincidunt neque.
          </p><p>

Duis eleifend est diam, blandit facilisis quam sollicitudin ut. Integer et orci ut massa blandit maximus ut in elit. Ut vestibulum vulputate orci. Phasellus massa nibh, rhoncus sed quam sit amet, convallis dapibus purus. Mauris in nibh vel dui luctus lacinia. Nam lobortis metus ipsum, non bibendum erat accumsan a. Nunc turpis lectus, semper rutrum augue et, ultrices dignissim massa. Nullam non felis vitae eros elementum eleifend sed et nulla. In molestie pellentesque mauris, at fermentum erat laoreet a. Nam posuere orci velit, eget sollicitudin lorem fermentum ut. Etiam volutpat at nunc non malesuada. In quis mattis ipsum. Morbi dapibus lorem eget dui dictum sodales. Mauris suscipit varius ligula, eget porttitor erat pellentesque et. Donec blandit pretium nisl quis pharetra.
          </p><p>

Aenean porttitor, velit non venenatis egestas, diam orci consequat nisl, id consectetur purus arcu id est. In aliquet et justo ut gravida. Duis nisi magna, placerat at mauris ac, tincidunt mollis arcu. Maecenas dignissim eros a dui tincidunt rhoncus. Vestibulum lacinia convallis nisi, vitae molestie nunc congue eget. Cras fringilla mi et ligula volutpat, congue egestas augue convallis. Vivamus elit diam, condimentum ac ultrices rhoncus, accumsan ut libero. Donec sit amet orci convallis, eleifend magna eu, faucibus libero. Aliquam nisl quam, aliquet ut erat nec, porta lacinia quam. Integer libero nunc, vulputate dapibus viverra vitae, faucibus vel diam. Morbi hendrerit, lacus eget congue convallis, nisl nulla vehicula justo, in pulvinar sapien libero ac tellus. Quisque consequat vitae tellus vitae feugiat. Duis orci justo, posuere eget blandit sed, semper vitae metus. Nam euismod dignissim massa sed sagittis. Sed tempus ante urna, pharetra sodales enim sagittis eget.
          </p><p>

Curabitur eu purus pellentesque, sodales risus sit amet, dictum magna. Nam tempus tempor mauris ut viverra. Nulla at porta risus, eu vestibulum est. Nam fringilla egestas nisl, eget blandit justo faucibus faucibus. Nunc mattis pellentesque dictum. Sed lobortis odio efficitur, lacinia neque eget, euismod est. Etiam eget maximus nulla. Fusce iaculis, leo a congue pretium, urna purus mollis nunc, nec consequat diam lectus ut velit.
          </p><p>
Quisque in lacinia eros. Integer sit amet pretium justo, sed vulputate sapien. Morbi luctus posuere facilisis. Duis laoreet elementum elementum. Etiam ex justo, molestie quis finibus at, pharetra ac turpis. Donec ultricies, eros sit amet laoreet imperdiet, ante ante venenatis justo, id pretium orci enim interdum dolor. Quisque efficitur faucibus arcu ac laoreet. In eget metus vel lorem auctor suscipit iaculis et metus. In ornare orci nec consectetur feugiat. Morbi faucibus, massa vel efficitur tincidunt, ante sapien tempor nibh, non ullamcorper felis odio et lacus. Integer vestibulum rhoncus justo, eget tristique justo gravida non. Fusce laoreet imperdiet sapien, non fringilla nunc congue non. Praesent tincidunt consectetur augue, et sollicitudin metus imperdiet non.
          </p>
        </div>
      </div>
    );
  }
});

