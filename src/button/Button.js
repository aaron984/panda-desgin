import classnames from 'classnames';
import React from 'react';
import TapFeedback from 'react-tap-feedback';
import Icon from '../Icon';

class Button extends React.PureComponent {
  static defaultProps = {
    prefixCls: 'panda-button',
    size: 'large',
    inline: false,
    disabled: false,
    loading: false,
  };

  render() {
    const { children, className, prefixCls, type, size, inline, disabled,
      icon, loading, activeStyle, activeClassName, onClick, ...restProps
    } = this.props;

    const iconType = loading ? 'loading' : icon;
    const wrapCls = classnames(prefixCls, className, {
      [`${prefixCls}--primary`]: type === 'primary',
      [`${prefixCls}--ghost`]: type === 'ghost',
      [`${prefixCls}--warning`]: type === 'warning',
      [`${prefixCls}--small`]: size === 'small',
      [`${prefixCls}--inline`]: inline,
      [`${prefixCls}--disabled`]: disabled,
      [`${prefixCls}--loading`]: loading,
      [`${prefixCls}--icon`]: !!iconType,
    });

    let iconEl;
    if (typeof iconType === 'string') {
      iconEl = (
        <Icon
          aria-hidden="true"
          type={iconType}
          size={size === 'small' ? 'xxs' : 'md'}
          className={`${prefixCls}-icon`}
        />
      );
    } else if (iconType) {
      const rawCls = iconType.props && iconType.props.className;
      const cls = classnames(
        'panda-icon',
        `${prefixCls}-icon`,
        size === 'small' ? 'panda-icon-xxs' : 'panda-icon-md',
      );
      iconEl = React.cloneElement(iconType, {
        className: rawCls ? `${cls} ${rawCls}` : cls,
      });
    }
    return (
      <TapFeedback
        activeClassName={activeClassName || `${prefixCls}--active`}
        disabled={disabled}
        activeStyle={activeStyle}
      >
        <a
          className={wrapCls}
          {...restProps}
          onClick={disabled ? undefined : onClick}
          aria-disabled={disabled}
        >
          {iconEl}
          {children}
        </a>
      </TapFeedback>
    );
  }
}

export default Button;