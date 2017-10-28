import React, { Component } from 'react';
import ReactModal from 'react-modal';
import InfiniteCalendar from 'react-infinite-calendar';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';

export default class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleOpenDatePicker = () => {
    this.setState({ open: true });
  }

  handleCloseDatePicker = () => {
    this.setState({ open: false });
  }

  render() {
    const { onSelect, iconStyle, iconColor } = this.props;
    return (
      <div>
        <IconButton
          color={iconColor}
          style={iconStyle}
          onClick={this.handleOpenDatePicker}
        >
          date_range
        </IconButton>
        <ReactModal
          isOpen={this.state.open}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 2,
            },
            content: {
              overflow: 'hidden',
              width: 360,
              height: 350,
              top: 100,
              left: 0,
              right: 0,
              border: 0,
              display: 'inline-block',
              margin: 'auto',
              padding: 0,
            },
          }}
          onRequestClose={this.handleCloseDatePicker}
          shouldCloseOnOverlayClick
        >
          <InfiniteCalendar
            width={360}
            height={350}
            locale={{
              locale: require('date-fns/locale/de'),   // eslint-disable-line global-require
              headerFormat: 'dddd, D MMM',
              weekdays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
              blank: 'Datum wählen',
              todayLabel: {
                long: 'Heute',
                short: 'Heute',
              },
              weekStartsOn: 1,
            }}
            theme={{
              selectionColor: '#ba3838',
              textColor: {
                default: '#333',
                active: '#FFF',
              },
              weekdayColor: '#ba3838',
              headerColor: '#ba3838',
              floatingNav: {
                background: '#ba3838',
                color: '#FFF',
                chevron: '#FFA726',
              },
            }}
            onSelect={onSelect}
          />
        </ReactModal>
      </div>
    );
  }
}

DatePicker.propTypes = {
  iconColor: PropTypes.string,
  iconStyle: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
};

DatePicker.defaultProps = {
  iconColor: 'contrast',
  iconStyle: { fontSize: 25 },
};
