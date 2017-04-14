import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { Link } from 'react-router';

import Header from './header.jsx'

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: []
    };
  }

  getChildContext() {
    return {
      addNotification: this.addNotification.bind(this)
    };
  }

  addNotification(notification) {
    const newNotification = Object.assign({
      time: 5,
      class: null,
      id: Math.round(Math.random() * 1000000),
      shown: false
    }, notification);
    const newNotifications = this.state.notifications;
    newNotifications.push(newNotification);
    this.setState(Object.assign({}, this.state, {
      notifications: newNotifications
    }));

    setTimeout(() => {
      const newNotifications = this.state.notifications.map(notification => {
        return Object.assign({}, notification, { shown: true });
      });
      this.setState(Object.assign({}, this.state, { notifications: newNotifications }));
    }, 10);

    setTimeout(() => {
      const newNotifications = this.state.notifications.map(notification => {
        if (notification.id === newNotification.id) {
          return Object.assign({}, notification, { shown: false });
        } else {
          return notification;
        }
      });
      this.setState(Object.assign({}, this.state, { notifications: newNotifications }));
    }, newNotification.time * 1000);

    setTimeout(() => {
      const newNotifications = this.state.notifications.filter(notification => {
        return notification.id !== newNotification.id;
      });
      this.setState(Object.assign({}, this.state, { notifications: newNotifications }));
    }, newNotification.time * 1000 + 500);
  }

  render() {
    const { children } = this.props;

    const notifications = this.state.notifications.map(notification => {
      const itemClass = [
        'notifications-item',
        `${notification.class ? `is-${notification.class}` : ''}`,
        `${notification.shown ? 'is-shown' : ''}`
      ].join(' ').trim();

      return (
        <div className={itemClass} key={notification.id}>
          {notification.text}
        </div>
      );
    });

    return (
      <div className='App'>
        <Header />
        <div className='notifications'>
          {notifications}
        </div>
        {children}
      </div>
    );
  }
}

Layout.childContextTypes = {
  addNotification: PropTypes.func.isRequired
};

export default DragDropContext(HTML5Backend)(Layout);
