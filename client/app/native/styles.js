const React = require('react-native');
const {StyleSheet, PixelRatio} = React;

module.exports = StyleSheet.create({
  autocomplete: {
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
    borderColor: 'grey',
    borderBottomWidth: 0.5,
    marginLeft: 15,
    marginRight: 15
  },
  activeItem: {color:'#81c04d', backgroundColor: '#fff', textAlign: 'center'},
  claimList: {flex: 1, alignItems: 'stretch'},
  claimListField: {flex: 1},
  claimListRow: {borderBottomWidth: 1 / PixelRatio.get(), flexDirection: 'row', flexWrap: 'wrap', flex: 1},
  container: {flex: 1, backgroundColor: '#F5FCFF'},
  error: {color: 'orange', paddingLeft: 15, paddingRight: 15, paddingBottom: 5},
  form: {flex: 1},
  full: {flex: 1000},
  hidden: {flex: 1},
  inactiveItem: {color:'#fff', textAlign: 'center'},
  input: {height:40, borderColor: 'gray', borderWidth: 1},
  label: {},
  tabButton: {flex: 1},
  tabbar: {backgroundColor:'#81c04d', paddingTop:10, paddingBottom:10, flexDirection:'row'},
  toolbar: {backgroundColor:'#81c04d', paddingTop:30, paddingBottom:10, flexDirection:'row'},
  toolbarButton: {color:'#fff', textAlign:'center'},
  toolbarTitle: {color:'#fff', textAlign:'center', fontWeight:'bold', flex:1},
  valueText: {height: 20, fontSize: 16, color: '#111111'}
});

