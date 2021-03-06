import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StatusBar, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';

import { Container } from '../components/Container';
import { Logo } from '../components/Logo';
import { InputWithButton } from '../components/TextInput';
import { ClearButton } from '../components/Button';
import { LastConverted } from '../components/Text';
import { Header } from '../components/Header';
import { connectAlert } from '../components/Alert';

import { OPTIONS } from '../screens/screenTypes';
import { changeCurrencyAmount, swapCurrency, getInitialConversion } from '../actions/currencies';

export class Home extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    baseCurrency: PropTypes.string,
    quoteCurrency: PropTypes.string,
    amount: PropTypes.number,
    conversionRate: PropTypes.number,
    lastConvertedDate: PropTypes.object,
    isFetching: PropTypes.bool,
    primaryColor: PropTypes.string,
    currencyError: PropTypes.string,
    alertWithType: PropTypes.func,
  };

  // dispatch an action generated by getInitialConversion() func when app starts
  componentWillMount() {
    this.props.dispatch(getInitialConversion());
  }

  // When props are received, it alerts if nextProps currencyError is not null
  componentWillReceiveProps(nextProps) {
    if (nextProps.currencyError) {
      this.props.alertWithType('error', 'Error', nextProps.currencyError);
    }
  }

  // when text change we are going to handle them with a new action
  handleChangeText = (text) => {
    this.props.dispatch(changeCurrencyAmount(text));
  };

  // when base currency pressed, it is going to navigate to CurrencyList
  handlePressBaseCurrency = () => {
    this.props.navigation.navigate('CurrencyList', {
      title: 'Base Currency',
      type: 'base',
    });
  };

  // when quote currency pressed, it is going to navigate to CurrencyList
  handlePressQuoteCurrency = () => {
    this.props.navigation.navigate('CurrencyList', {
      title: 'Quote Currency',
      type: 'quote',
    });
  };

  // dispatch actions when these things happen
  handleSwapCurrency = () => {
    this.props.dispatch(swapCurrency());
  };
  handleOptionsPress = () => {
    this.props.navigation.navigate(OPTIONS);
  };

  // The UI piece
  render() {
    // iniitial quotePrice will be ..., unless this.props.isFetching becomes false,
    // which will trigger a re-render
    let quotePrice = '...';
    if (!this.props.isFetching) {
      quotePrice = (this.props.amount * this.props.conversionRate).toFixed(2);
    }

    // renders a container with a background within which there are components such as
    // StausBar for displaying carrier info, date and battery info, Header for handling
    // gear icon press, Logo for showing animations, InputWithButton for display button
    // and text inputs, lastConvert for purely displaying last converted time
    // clearButton for reversing the conversion buttons
    return (
      <Container backgroundColor={this.props.primaryColor}>
        <StatusBar backgroundColor="blue" barStyle="light-content" />
        <Header onPress={this.handleOptionsPress} />
        <KeyboardAvoidingView behavior="padding">
          <Logo tintColor={this.props.primaryColor} />

          <InputWithButton
            buttonText={this.props.baseCurrency}
            onPress={this.handlePressBaseCurrency}
            defaultValue={this.props.amount.toString()}
            keyboardType="numeric"
            onChangeText={this.handleChangeText}
            textColor={this.props.primaryColor}
          />

          <InputWithButton
            editable={false}
            buttonText={this.props.quoteCurrency}
            onPress={this.handlePressQuoteCurrency}
            value={quotePrice}
            textColor={this.props.primaryColor}
          />

          <LastConverted
            date={this.props.lastConvertedDate}
            base={this.props.baseCurrency}
            quote={this.props.quoteCurrency}
            conversionRate={this.props.conversionRate}
          />

          <ClearButton onPress={this.handleSwapCurrency} text="Reverse Currencies" />
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

// binds nodes in the state tree to props of this component
const mapStateToProps = (state) => {
  const baseCurrency = state.currencies.baseCurrency;
  const quoteCurrency = state.currencies.quoteCurrency;
  const conversionSelector = state.currencies.conversions[baseCurrency] || {};
  const rates = conversionSelector.rates || {};

  return {
    baseCurrency,
    quoteCurrency,
    amount: state.currencies.amount,
    conversionRate: rates[quoteCurrency] || 0,
    lastConvertedDate: conversionSelector.date ? new Date(conversionSelector.date) : new Date(),
    isFetching: conversionSelector.isFetching,
    primaryColor: state.theme.primaryColor,
    currencyError: state.currencies.error,
  };
};

// Connect allows mapStateToProps function, connectAlert sets up alert message if any network error
export default connect(mapStateToProps)(connectAlert(Home));
