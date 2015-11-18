import _ from 'underscore';
import React, {ScrollView, View, Text} from 'react-native';
import Button from './react-native-custom-action-sheet/button.js';
import ItemView from './ItemView.jsx';
import ItemEdit from './ItemEdit.jsx';
import normalizeDate from '../data/normalizeDate';
import dollars from '../data/dollars';
import { itemTotal } from '../data/claimTotal';

class NewItemButton extends React.Component {
  handlePress() {
    var template = {
      day: normalizeDate(''),
    }
    if (this.props.index !== undefined) {
      var item = this.props.claim.items[this.props.index];
      template.day = item.day;
      template.time_in = item.time_in;
      template.time_out = item.time_out;
    }
    this.props.actions.newItem(this.props.claim.id, template);
    this.props.expand((this.props.index === undefined ? -1 : this.props.index) + 1);
  }

  render() {
    return <Button text="Add new code" onPress={this.handlePress.bind(this)} />;
  }
}

export default class ItemList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {expanded: -1};
  }

  expand(item) {
    this.setState({expanded: item});
  }

  render() {
    var items = this.props.claim.items;
    var lastIndex;
    if (items.length) {
      var days = _.uniq(items.map((item) => item.day)).sort();
      return React.createElement(View,
                                 {},
                                 days.map(function(day) {
        return (
          <View key={'item-day-'+day}>
            <View key={"day-header-"+day}>
              <Text>
              {day}
              {dollars(items.reduce(function(memo, item) {
                  return item.day === day ? memo + itemTotal(item) : memo;
              }, 0))}
              </Text>
            </View>
            <View key={"day-body-"+day}>
             {items.map(function(item, i) {
               if (item.day === day) {
                 lastIndex = i;
                 return React.createElement(
                   this.state.expanded !== i || this.props.readonly ? ItemView : ItemEdit, {
                     claim: this.props.claim,
                     store: this.props.claim.items[i],
                     item: this.props.claim.items[i],
                     index: i,
                     key: item.id,
                     full: this.props.full || this.props.agent,
                     silent: this.props.silent,
                     expanded: this.state.expanded === i,
                     expand: !this.props.readonly && this.expand.bind(this, i),
                     collapse: this.expand.bind(this, -1),
                     readonly: this.props.readonly,
                     dispatch: this.props.dispatch,
                     onUpdate: this.props.actions.updateItem.bind(null, this.props.claim.id, item.id)
                 });
               } else {
                 return null;
               }
              }, this)
            }
            </View>
            {this.props.readonly ? null : <NewItemButton key={"day-button-"+day} index={lastIndex} actions={this.props.actions} expand={this.expand} claim={this.props.claim} />}
          </View>
        )
      }, this));
    } else if (!this.props.readonly) {
      return <NewItemButton actions={this.props.actions} expand={this.expand} claim={this.props.claim} />;
    } else {
      return null;
    }
  }
};
