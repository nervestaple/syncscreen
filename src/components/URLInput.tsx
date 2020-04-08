import { PlayCircleOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import * as React from 'react';

interface Props {
  onChange: React.ChangeEventHandler;
  value: string;
}

export function URLInput({ onChange, value }: Props) {
  return (
    <Input
      size="large"
      placeholder=" video URL"
      prefix={<PlayCircleOutlined />}
      type="url"
      value={value}
      onChange={onChange}
    />
  );
}

export function useInputURL() {
  const [inputValue, setInputValue] = React.useState('');
  const [lastValidURL, setLastValidURL] = React.useState<string | null>(null);
  const [lastSetTime, setLastSetTime] = React.useState(() => Date.now());
  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    (event) => {
      const newValue = event.target.value;
      setInputValue(newValue);
      if (isURLValid(newValue)) {
        setLastValidURL(newValue);
        setLastSetTime(Date.now());
      }
    },
    [],
  );

  return {
    inputValue,
    inputURL: lastValidURL,
    lastSetTime,
    onInputChange: handleInputChange,
  };
}

function isURLValid(text: string) {
  try {
    new URL(text);
  } catch (e) {
    return false;
  }
  return true;
}
