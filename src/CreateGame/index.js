import { Button, Form, Input, Select, Typography } from "antd";
import React, { useContext } from "react";

import { GlobalProvider } from "../App";
import socket from "../io";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const { Option } = Select;
export const CreateGame = () => {
  const { series, updateGlobalData } = useContext(GlobalProvider);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const finalGameName = values.gameName.toLowerCase();
    await socket.emit("game_name", finalGameName);
    const activeUsers = [{ name: values.name, point: null }];
    await socket.emit("add_user", {
      series: values.votingMethod,
      game_name: finalGameName,
      activeUsers,
    });
    updateGlobalData({
      selectedSeries: values.votingMethod,
      isAdmin: true,
      isGameStart: true,
      name: values.name,
      points: null,
      activeUsers,
    });
    navigate(`/start-game/${finalGameName}`);
  };

  return (
    <>
      <Text>Choose a name and a voting system for your game.</Text>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Game's name"
          name="gameName"
          rules={[
            {
              required: true,
              message: "Please enter your game name. No spaces and special characters are allowed.",
              pattern: new RegExp(
                /^[a-zA-Z@~`!@#$%^&*()_=+\\\\';:\"\\/?>.<,-]+$/i
              ),
            },
          ]}
        >
          <Input placeholder="Game's name" />
        </Form.Item>
        <Form.Item
          label="Voting system"
          name="votingMethod"
          rules={[
            { required: true, message: "Please select the voting system." },
          ]}
        >
          <Select>
            {series.map((record, index) => {
              return (
                <Option key={index} value={record.value}>
                  {record.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="Your's name"
          name="name"
          rules={[{ required: true, message: "Please enter your name!" }]}
        >
          <Input placeholder="Your's name" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          <Button type="primary" htmlType="submit">
            Start
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
