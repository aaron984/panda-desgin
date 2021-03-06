import React from 'react';
import DemoBlock from 'docs/mobileComponents/DemoBlock';
import Stepper from '../index';

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      val: 3,
    };
  }
  onChange = (val) => {
    console.log(val);
    this.setState({ val });
  }
  render() {
    return (
      <div className="demo-radio">
        <DemoBlock title="基础用法" className="has-padding">
          <Stepper
            style={{ width: '100%', minWidth: '100px' }}
            max={10}
            min={1}
            onChange={this.onChange}
          />
        </DemoBlock>
        <DemoBlock title="disabled" className="has-padding">
          <Stepper
            style={{ width: '100%', minWidth: '100px' }}
            max={10}
            min={1}
            defaultValue={3}
            disabled
          />
        </DemoBlock>
        <DemoBlock title="设置step" className="has-padding">
          <Stepper
            style={{ width: '100%', minWidth: '100px' }}
            max={10}
            min={1}
            step={0.4}
            value={this.state.val}
            onChange={this.onChange}
          />
        </DemoBlock>
        <DemoBlock title="readOnly" className="has-padding">
          <Stepper
            style={{ width: '100%', minWidth: '100px' }}
            max={10}
            min={1}
            readOnly
            defaultValue={3}
          />
        </DemoBlock>
      </div>
    );
  }
}
