import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollView, StatusBar } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ListItem, Separator } from '../components/List';
import { themeAction } from '../actions';

// import { NavigationActions } from 'react-navigation';
// import { HOME } from './screenTypes';

const styles = EStyleSheet.create({
  $blue: '$primaryBlue',
  $orange: '$primaryOrange',
  $green: '$primaryGreen',
  $purple: '$primaryPurple',
});

export class Themes extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    actions: PropTypes.object,
  };

  handlePressTheme = (color) => {
    this.props.actions.changePrimaryColor(color);
    // const resetAction = NavigationActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName: HOME })],
    // });
    this.props.navigation.goBack(this.props.navigation.state.params.screenKey);
    // this.props.navigation.dispatch(resetAction);
  };

  render() {
    return (
      <ScrollView>
        <StatusBar translucent={false} barStyle="default" />
        <ListItem
          text="Blue"
          onPress={() => this.handlePressTheme(styles.$blue)}
          selected
          checkmark={false}
          iconBackground={styles.$blue}
        />
        <Separator />
        <ListItem
          text="Orange"
          onPress={() => this.handlePressTheme(styles.$orange)}
          selected
          checkmark={false}
          iconBackground={styles.$orange}
        />
        <Separator />
        <ListItem
          text="Green"
          onPress={() => this.handlePressTheme(styles.$green)}
          selected
          checkmark={false}
          iconBackground={styles.$green}
        />
        <Separator />
        <ListItem
          text="Purple"
          onPress={() => this.handlePressTheme(styles.$purple)}
          selected
          checkmark={false}
          iconBackground={styles.$purple}
        />
        <Separator />
      </ScrollView>
    );
  }
}

// binds this dispatch action with themeAction so it can be called without dispatch(action)
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(themeAction, dispatch),
});

export default connect(null, mapDispatchToProps)(Themes);
