import _ from 'underscore';
import ClaimItemList from '../components/ClaimItemList';
import ItemGenerator from '../data/ItemGenerator';

export default React.createClass({
  generate: function() {
    var gen = new ItemGenerator(this.props.claim, this.props);
    gen.go();
  },

  render: function() {
    var gen = new ItemGenerator(this.props.claim, this.props);
    return (
      <div>
      { (gen.toAdd.length > 0 || gen.toRemove.length > 0 ) &&
        <div className="row">
          <div className="col-sm-12">
            <button className="btn btn-info btn-block" onClick={this.generate} disabled={(gen.toAdd.length + gen.toRemove.length) === 0}>
              <i className="fa fa-cogs" /> Generate: add {gen.toAdd.length} codes, remove {gen.toRemove.length}
            </button>
          </div>
        </div>
      }

        <ClaimItemList {...this.props}/>
      </div>
    );
  }
});

