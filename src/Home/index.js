import { Button, Typography } from 'antd';

import { Link } from "react-router-dom";

export const HomePage = () => {
  const { Title } = Typography;
    return <>
      <div>
      <Title>Scrum Poker for agile development teams</Title>
      <div ><Button type="primary" loading={false}><Link to={'/new-game'}>Start game</Link></Button></div>
      </div>
    </>
}
