import { withCallbacks } from '../helpers';

modulejs.define('HBWFormFileUpload',
  ['React', 'HBWDeleteIfMixin', 'HBWTranslationsMixin'],
  (React, DeleteIfMixin, TranslationsMixin) => {
    const FormFileUpload = React.createClass({
      mixins: [DeleteIfMixin, TranslationsMixin],

      displayName: 'HBWFormFileUpload',

      getInitialState () {
        return {
          valid:      true,
          files:      [],
          filesCount: 0
        };
      },

      render () {
        const opts = {
          name:     this.props.params.name,
          onChange: this.onChange
        };

        const hiddenValue = JSON.stringify({ files: this.state.files });

        let cssClass = this.props.params.css_class;
        if (this.hidden) {
          cssClass += ' hidden';
        }

        const errorMessage = this.t('errors.file_list_field_required');
        let errorMessageCss = 'alert alert-danger';

        if (this.props.fileListPresent) {
          errorMessageCss += ' hidden';
        }

        const { label } = this.props.params;
        const labelCss = this.props.params.label_css;

        return <div className={cssClass}>
          <span className={labelCss}>{label}</span>
          <div className={errorMessageCss}>{errorMessage}</div>
          <div className="form-group">
            <input {...opts} type="file" multiple></input>
            <input name={this.props.params.name} value={hiddenValue} type="hidden"/>
          </div>
        </div>;
      },

      onChange (event) {
        const $el = event.target;
        const files = Array.from($el.files);

        this.setState({
          files:      [],
          filesCount: files.length
        });

        if (files.length > 0) {
          this.props.trigger('hbw:file-upload-started');

          return files.map(file => this.readFiles(file.name, file));
        }

        return null;
      },

      addValue (name, res) {
        const { files } = this.state;

        files.push({
          name,
          content: window.btoa(res)
        });

        this.setState({
          files,
          filesCount: this.state.filesCount - 1
        });

        if (this.state.filesCount === 0) {
          this.props.trigger('hbw:file-upload-finished');
        }
      },

      readFiles (name, file) {
        const fileReader = new FileReader();

        fileReader.onloadend = () => {
          this.addValue(name, fileReader.result);
        };

        return fileReader.readAsBinaryString(file);
      }
    });

    return withCallbacks(FormFileUpload);
  });
