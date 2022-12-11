import React, { useCallback, useEffect, useState } from "react";
import { Control } from "rete";

// React v17
const MyReactControl = ({ name, putData, id, emitter }) => {
  const [_name, _setName] = useState(name);

  useEffect(() => {
    putData(id, name);
  }, [putData, id, name]);

  const _onChange = useCallback(
    (event) => {
      putData(id, name);
      emitter.trigger("process");
      _setName(event.target.value);
    },
    [putData, emitter, id, name]
  );

  return <input value={_name} onChange={_onChange} />;
};

export class MyControl extends Control {
  constructor(emitter, key, name) {
    super(key);
    this.render = "react";
    this.component = MyReactControl;
    this.props = {
      emitter,
      id: key,
      name,
      putData: (...args) => {
        this.putData(args[0], args[1]);
      },
    };
  }
}
