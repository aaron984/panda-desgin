/* eslint-disable no-console */
import React from 'react';
import Notification from '../index';

let notification = null;
Notification.newInstance({}, n => notification = n);

function simpleFn() {
  notification.notice({
    content: <span>simple show</span>,
    onClose() {
      console.log('simple close');
    },
  });
}

function durationFn() {
  notification.notice({
    content: <span>can not close...</span>,
    duration: null,
  });
}

function closableFn() {
  notification.notice({
    content: <span>closable</span>,
    duration: null,
    onClose() {
      console.log('closable close');
    },
    closable: true,
  });
}

function close(key) {
  notification.removeNotice(key);
}

function manualClose() {
  const key = Date.now();
  notification.notice({
    content: (
      <div>
        <p>click below button to close</p>
        <button onClick={close.bind(null, key)}>close</button>
      </div>
    ),
    key,
    duration: null,
  });
}

export default () => (
  <div>
    <div>
      <button onClick={simpleFn}>simple show</button>
      <button onClick={durationFn}>duration=0</button>
      <button onClick={closableFn}>closable</button>
      <button onClick={manualClose}>controlled close</button>
    </div>
  </div>
);
