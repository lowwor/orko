import React from 'react';
import { connect } from 'react-redux';

import Immutable from 'seamless-immutable';
import { Flex, Box } from 'rebass';

import LimitOrder from '../components/LimitOrder';
import Job from '../components/Job';

import * as focusActions from '../store/focus/actions';
import * as jobActions from '../store/job/actions';

class LimitOrderContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      job: Immutable({
        limitPrice: '',
        amount: '',
        direction: 'BUY',
        track: false
      })
    }
  }

  onChange = job => {
    this.setState({
      job: job
    })
  };

  onFocus = focusedProperty => {
    this.props.dispatch(
      focusActions.setUpdateAction(value => {
        console.log("Set focus to" + focusedProperty);
        this.setState(prev => ({
          job: prev.job.merge({
            [focusedProperty]: value
          }) 
        }))
      })
    )
  }

  createJob = () => {
    const tickTrigger = {
      exchange: this.props.coin.exchange,
      counter: this.props.coin.counter,
      base: this.props.coin.base
    };

    return {
      jobType: "LimitOrderJob",
      tickTrigger: tickTrigger,
      bigDecimals: {
        amount: this.state.job.amount,
        limitPrice: this.state.job.limitPrice
      },
      direction: this.state.job.direction,
      track: this.state.job.track
    }
  };

  onSubmit = async() => {
    this.props.dispatch(jobActions.submitJob(this.createJob()));
  }

  render() {

    const isValidNumber = (val) => !isNaN(val) && val !== '' && val > 0;
    const limitPriceValid = this.state.job.limitPrice && isValidNumber(this.state.job.limitPrice);
    const amountValid = this.state.job.amount && isValidNumber(this.state.job.amount);

    return (
      <Flex flexWrap='wrap'>
        <Box width={1/3}>
          <LimitOrder
            job={this.state.job}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onSubmit={this.onSubmit}
            limitPriceValid={limitPriceValid}
            amountValid={amountValid}
          />
        </Box>
        <Box width={2/3}>
          <Job job={this.createJob()} />
        </Box>
      </Flex>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps)(LimitOrderContainer);