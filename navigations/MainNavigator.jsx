import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction } from '../store/ActivityActions';

import HomeNavigator from './HomeNavigator';


const Stack = createStackNavigator();

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setStateAction,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

class MainNavigator extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.navigation = this.props.navigation;
    this.route = this.props.route;
  }

  render(){
    return (
        <Stack.Navigator>
          <Stack.Screen
            name="HomeNavigator"
            component={HomeNavigator}
            route={this.route}
            navigation={this.navigation}
            options={{ headerLeft: false, headerTitle: false, headerStyle: { height: 0 },}}
          />
        </Stack.Navigator>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MainNavigator);
