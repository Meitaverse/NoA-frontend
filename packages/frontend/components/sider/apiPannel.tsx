import { Input, Radio, RadioChangeEvent } from "antd";
import React, { FC, useState } from "react";
import styles from "./apiPannel.module.scss";

interface IProps {}

interface ContractField {
  defaultValue?: any;
  name: string;
  type: string;
}

const ContractField = (props: { field: ContractField }) => {
  const { field } = props;
  const [val, setValue] = useState("");
  return (
    <div>
      <span>{field.name}</span>

      {
        <Input
          value={val}
          onChange={e => {
            setValue(e.target.value);
          }}
        ></Input>
      }
    </div>
  );
};

const ApiPannel: FC<IProps> = props => {
  const [contractRadio, setContractRadio] = useState(1);
  const [contractName, setContractName] = useState("");
  const [contractFieldes, setContractFieldes] = useState<ContractField[]>([]);

  return (
    <div className={styles.apiPannel}>
      <h3>合约调用类型</h3>
      <Radio.Group
        onChange={(e: RadioChangeEvent) => {
          setContractRadio(e.target.value);
        }}
        value={contractRadio}
      >
        <Radio value={1}>Set</Radio>
        <Radio value={2}>Get</Radio>
      </Radio.Group>

      <h3>合约名称</h3>
      <Input
        value={contractName}
        onChange={e => {
          setContractName(e.target.value);
        }}
        placeholder="要调用的合约名称"
      ></Input>

      <div style={{ marginTop: "20px" }}></div>

      <h3>合约调用参数</h3>
      <div>
        {contractFieldes?.map(item => {
          return (
            <div key={item.name}>
              <ContractField field={item}></ContractField>

              <div style={{ marginLeft: "10px" }}>-</div>
            </div>
          );
        })}

        <div style={{ marginTop: "10px" }}>+</div>
      </div>
      <div>操作按钮，清空，调用，保存为模板</div>
    </div>
  );
};
export default ApiPannel;
