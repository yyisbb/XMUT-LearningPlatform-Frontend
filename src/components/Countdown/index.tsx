import React, { useState, useEffect } from 'react';
import moment, { Moment } from 'moment';
import { Typography } from '@arco-design/web-react';
import Title from '@arco-design/web-react/lib/Typography/title';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  targetDate: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = moment();
      const endDate = moment(targetDate);
      const diff = endDate.diff(now);
      const duration = moment.duration(diff);

      setTimeLeft({
        days: Math.floor(duration.asDays()),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      });

      if (diff < 0) {
        clearInterval(intervalId);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  return (
    <Typography>
      <Title type={'error'} heading={5}>
        {moment(targetDate).diff(moment()) < 0
          ? '签到已过期'
          : `${timeLeft.minutes} 分 ${timeLeft.seconds} 秒`}
      </Title>
    </Typography>
  );
};

export default Countdown;
