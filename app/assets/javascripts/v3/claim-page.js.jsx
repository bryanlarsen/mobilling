var SWIPE_DISTANCE=60;

var ClaimPage = React.createClass({
  mixins: [ ReactRouter.State ],

  icon: {
    patient: 'user',
    claim: 'medkit',
    consult: 'user-md',
    items: 'list-alt',
    comments: 'comment-o'
  },

  tabs: function() {
    if (this.props.store.get('template') === 'full') {
      return ['patient', 'claim', 'consult', 'items', 'comments'];
    } else {
      return ['patient', 'claim', 'items', 'comments'];
    }
  },

  componentDidMount: function(ev) {
    this.fixTab();
  },

  componentDidUpdate: function(ev) {
    this.fixTab();
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
    this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
  },

  submit: function(ev) {
    ev.preventDefault();
    this.props.actions.updateFields([[['status'], 'for_agent']]);
  },

  render: function() {
    // onTouchStart={this.touchStart} onTouchMove={this.touchMove} onTouchEnd={this.touchEnd}
    return (
      <div className="body">
        <ClaimHeader {...this.props} submit={this.props.store.get('status')==='saved' && this.submit}/>
        <div className="container with-bottom">
          <div className="form-horizontal">
            <RouteHandler {...this.props} handleChange={this.handleChange} silent />
          </div>
        </div>
        <Navbar fixedBottom>
          <ul id="tab-nav" className="nav navbar-nav nav-justified" style={{position: 'relative'}}>
            { _.map(this.tabs(), function(tab) {
               return <NavItemLink key={"claim_tab_"+tab} to={"claim_"+tab} params={{id:this.props.params.id}}>
                        <Icon i={this.icon[tab]} xs>{s.humanize(tab)}</Icon>
                      </NavItemLink>;
            }, this) }
            <div id="highlight"></div>
          </ul>
        </Navbar>
      </div>
    );
  }
});

