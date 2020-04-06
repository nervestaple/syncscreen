import { Button } from 'antd';
import * as React from 'react';

import { URLInput } from './URLInput';

interface Props {
  inputValue: string;
  onInputChange: React.ChangeEventHandler;
  onFilePickerClick: React.MouseEventHandler;
}

export function URLControl({
  inputValue,
  onInputChange,
  onFilePickerClick,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        paddingTop: 20,
      }}
    >
      <div style={{ padding: '0 30px' }}>
        <Button type="primary" size="large" onClick={onFilePickerClick}>
          Choose file...
        </Button>
      </div>
      <div>OR</div>
      <div style={{ padding: '0 30px', flexGrow: 1 }}>
        <URLInput onChange={onInputChange} value={inputValue} />
      </div>
    </div>
  );
}
