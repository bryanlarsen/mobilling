const React = require('react-native');
const {StyleSheet, PixelRatio} = React;

module.exports = StyleSheet.create({
  full: {flex: 1000},
  hidden: {flex: 1},
  container: {flex: 1, backgroundColor: '#F5FCFF'},
  form: {flex: 1},
  claimList: {flex: 1, alignItems: 'stretch'},
  claimListRow: {borderBottomWidth: 1 / PixelRatio.get(), flexDirection: 'row', flexWrap: 'wrap', flex: 1},
  claimListField: {flex: 1},
  tabbar: {backgroundColor:'#81c04d', paddingTop:10, paddingBottom:10, flexDirection:'row'},
  inactiveItem: {color:'#fff', textAlign: 'center'},
  activeItem: {color:'#81c04d', backgroundColor: '#fff', textAlign: 'center'},
  tabButton: {flex: 1},
  toolbar: {backgroundColor:'#81c04d', paddingTop:30, paddingBottom:10, flexDirection:'row'},
  toolbarButton: {color:'#fff', textAlign:'center'},
  toolbarTitle: {color:'#fff', textAlign:'center', fontWeight:'bold', flex:1},
  input: {height:40, borderColor: 'gray', borderWidth: 1},
  label: {},
  error: {color: 'orange', paddingLeft: 15, paddingRight: 15, paddingBottom: 5}
});
