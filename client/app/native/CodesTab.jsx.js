import React, {ScrollView} from 'react-native';
import Button from './react-native-custom-action-sheet/button.js';
import ItemList from './ItemList.jsx';
import styles from './styles';
import ItemGenerator from '../data/ItemGenerator';

export default class CodesTab extends React.Component {
  render() {
    var gen = new ItemGenerator(this.props.claim, this.props);
    return <ScrollView style={styles.container} contentContainerStyle={styles.form}>
      <Button text={`Generate: add ${gen.toAdd.length} codes, remove ${gen.toRemove.length}`} onPress={() => gen.go()} />
      <ItemList {...this.props} />
    </ScrollView>;
  }
};
