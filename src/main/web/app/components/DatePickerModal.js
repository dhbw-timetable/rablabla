import React from 'react';
import ReactModal from 'react-modal';
import InfiniteCalendar from 'react-infinite-calendar';
import PropTypes from 'prop-types';

export default function DatePickerModal(props) {
  const { onRequestClose, open, onSelect } = props;
  return (
    <ReactModal
      isOpen={open}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 2,
        },
        content: {
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
      onRequestClose={onRequestClose}
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
  );
}

DatePickerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};
