import { Button, Layout, Menu } from "antd";
import React, { useContext } from "react";

import { GlobalProvider } from "../App";
import { Link } from "react-router-dom";
import socket from "../io";
import { useParams } from "react-router-dom";

const { Header, Content, Footer } = Layout;

export const CustomLayout = ({ children }) => {
  const { isGameStart, selectedSeries, name, activeUsers, updateGlobalData, isSelected } =
    useContext(GlobalProvider);
  const { game_name } = useParams();

  const handlePoints = async (number) => {
    updateGlobalData({number});
    const newList = activeUsers.map((user) => {
      if (user.name === name) {
        return { ...user, point: number };
      }
      return user;
    });
    console.log(newList, "game name also", game_name);
    updateGlobalData({ activeUsers: [...newList] });
    await socket.emit("add_user", {
      type: "points",
      game_name,
      selectedSeries,
      activeUsers: [...newList],
    });
  };

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key={1}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key={2}>
            <Link to="/new-game">Start game</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px", marginTop: "100px" }}>
        <div
          style={{
            width: "100%",
            justifyContent: "center",
            textAlign: "-webkit-center",
          }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        <div style={{ marginTop: "100px" }}>
          {isGameStart &&
            (selectedSeries?.split(",") || []).map((number) => {
              return (
                <Button
                  type={isSelected === number ? "primary" : "default"}
                  onClick={() => handlePoints(number)}
                  size="large"
                  shape="circle"
                >
                  {number}
                </Button>
              );
            })}
        </div>
      </Footer>
    </Layout>
  );
};
