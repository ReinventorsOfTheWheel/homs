/* eslint no-script-url: "off" */

modulejs.define('HBWError', ['React', 'HBWTranslationsMixin'], (React, TranslationsMixin) => {
  const { t } = TranslationsMixin;

  return React.createClass({
    mixins: [TranslationsMixin],

    displayName: 'HBWError',

    getDefaultProps () {
      return { errorHeader: t('error') };
    },

    getInitialState () {
      return { showFull: false };
    },

    render () {
      let display;

      if (this.props.error) {
        let error;
        let iconClass;

        if (this.state.showFull) {
          display = 'block';
          iconClass = 'fa fa-chevron-down';
        } else {
          display = 'none';
          iconClass = 'fa fa-chevron-right';
        }

        if ({}.hasOwnProperty.call(this.props.error, 'responseText')) {
          error = this.props.error.responseText;
        } else {
          ({ error } = this.props);
        }

        return <div className="alert alert-danger hbw-error">
          <i className="fa fa-exclamation-triangle"></i>
          <strong>{` ${this.props.errorHeader}`}</strong>
          <br />
          <a href="javascript:;"
            onClick={this.toggleBacktrace}
            className="show-more"
            style={{ display: error ? 'block' : 'none' }}>
            <i className={iconClass}></i>
            {this.t('more')}
          </a>
          <pre style={{ display }}>{error}</pre>
        </div>;
      } else {
        return <div style={{ display: 'none' }}></div>;
      }
    },

    toggleBacktrace () {
      this.setState({ showFull: !this.state.showFull });
    }
  });
});
