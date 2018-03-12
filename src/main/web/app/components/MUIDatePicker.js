import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePicker } from 'material-ui-pickers';
import IconButton from 'material-ui/IconButton';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';

export default class MUIDatePicker extends Component {

  dateInput = null;

  constructor(props) {
    super(props);
    this.state = {
      selectedDate: props.date,
    };
  }

  render() {
    const { iconProps, pickerProps, onDateSelected } = this.props;
    return (
      <div>
        <IconButton
          onClick={() => {
            this.dateInput.click();
          }}
          {...iconProps}
        >
          date_range
        </IconButton>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DatePicker
            style={{ display: 'none' }}
            value={this.state.selectedDate}
            inputRef={el => this.dateInput = el}
            onChange={(momentDate) => { onDateSelected(momentDate); }}
            {...pickerProps}
          />
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}

MUIDatePicker.propTypes = {
  iconProps: PropTypes.object,
  pickerProps: PropTypes.object,
  date: PropTypes.object,
  onDateSelected: PropTypes.func.isRequired,
};

MUIDatePicker.defaultProps = {
  date: moment(),
  iconProps: { color: 'contrast', style: { fontSize: 25 } },
  pickerProps: {},
};
