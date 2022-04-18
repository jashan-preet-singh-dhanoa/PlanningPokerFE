import "./GamePage.css";

import { Badge, Button, Form, Input, Space, Tag } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import React, { useCallback, useContext, useEffect } from "react";

import { GlobalProvider } from "../App";
import socket from "../io";
import { useParams } from "react-router-dom";

export const GamePage = () => {
  const {
    updateGlobalData,
    isAdmin,
    isGameStart,
    activeUsers,
    selectedSeries,
    isShowCount,
    gameOver
  } = useContext(GlobalProvider);
  const { game_name } = useParams();

  useEffect(() => {
    (async () => await socket.emit("game_name", game_name))();
  }, [game_name]);


  const callSocket = useCallback(async () => {
    socket.on("receive_user", (data) => {
      console.log(isAdmin, "jai ho check", data);
      if (isAdmin && data?.type === "normal") {
        updateGlobalData({
          isShowCount,
          activeUsers: [...activeUsers, data.activeUsers],
        });
      } else if (
        data?.type !== "normal" &&
        data?.type !== "points" &&
        data?.type !== "showPoints" &&
        (activeUsers.length < data.activeUsers || activeUsers.length === 0)
      ) {
        updateGlobalData({
          selectedSeries: data.selectedSeries,
          activeUsers: [...data.activeUsers],
        });
      } else if (data?.type === "points") {
        updateGlobalData({ isShowCount, activeUsers: [...data.activeUsers] });
      } else if (data?.type === "showPoints") {
        updateGlobalData({ isShowCount: data.isShowCount });
      } else if (data?.type === "removePoints") {
        updateGlobalData({
          isShowCount: data.isShowCount,
          activeUsers: [...data.activeUsers],
        });
      }
    });
  }, [activeUsers, isAdmin, isShowCount, updateGlobalData]);

  useEffect(() => {
    if (isAdmin) {
      socket.emit("add_user", {
        selectedSeries,
        game_name,
        activeUsers: [...activeUsers],
        totalUsers: activeUsers.length,
      });
      console.log("in admin section", activeUsers);
    }
  }, [activeUsers, game_name, isAdmin, selectedSeries]);

  useEffect(() => {
    callSocket();
  });

  const onFinish = async ({ playerName }) => {
    updateGlobalData({ name: playerName, points: null, isGameStart: true });
    await socket.emit("add_user", {
      game_name,
      activeUsers: { name: playerName, point: null },
      type: "normal",
    });
  };

  const handleBadgeStatus = (point) => {
    if (isShowCount) {
      return <span>{point}</span>;
    }
    if (point) {
      return <CheckCircleOutlined style={{ color: "#008000	" }} />;
    } else {
      return <ClockCircleOutlined style={{ color: "#f5222d" }} />;
    }
  };

  const handleClearPoints = async () => {
    const removePoints = activeUsers.map((data) => {
      data.point = null;
      return data;
    });
    updateGlobalData({ isShowCount: false, activeUsers: removePoints });
    await socket.emit("add_user", {
      game_name,
      isShowCount: false,
      activeUsers: removePoints,
      type: "removePoints",
    });
  };

  const handleShowPoints = async () => {
    updateGlobalData({ isShowCount: true });
    await socket.emit("add_user", {
      game_name,
      isShowCount: true,
      type: "showPoints",
    });
  };

  if(gameOver){
      return <h1>
          Game Over! Admin left the game.
      </h1>
  }

  if (!isGameStart) {
    return (
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Your's name"
          name="playerName"
          rules={[{ required: true, message: "Please enter your name!" }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          <Button type="primary" htmlType="submit">
            Start
          </Button>
        </Form.Item>
      </Form>
    );
  }

  return (
    <>
      <div style={{ display: "flex", overflow: "wrap" }}>
        <Space size={23}>
          {activeUsers.map((player, index) => {
            return (
              <div key={index}>
                <Badge count={handleBadgeStatus(player.point)}>
                  <Tag color="#2db7f5">{player.name}</Tag>
                </Badge>
              </div>
            );
          })}
        </Space>
      </div>
      {isAdmin && (
        <div style={{ marginTop: "20px" }}>
          <Space size={23}>
            <Button type="primary" onClick={handleShowPoints}>
              Show
            </Button>
            <Button type="default" onClick={handleClearPoints}>
              Clear
            </Button>
          </Space>
        </div>
      )}
    </>
  );
};
