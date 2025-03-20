import * as React from 'react';
import {
  Text,
  Title1,
  Card,
  CardHeader,
  Button,
  Label,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { PlayCircleRegular } from '@fluentui/react-icons';

interface Sentence {
  id: number;
  question: string;
  answer: string;
  audioUrl?: string;
}

interface SpeakingPracticeProps {
  questionTimeout?: number;
  answerTimeout?: number;
}

const useStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px', // 设置子项之间的间距
  },
  card: {
    padding: tokens.spacingVerticalXXL,
  },
  question: {
    fontSize: tokens.fontSizeHero900,
    marginBottom: tokens.spacingVerticalL,
  },
  answer: {
    fontSize: tokens.fontSizeHero700,
    color: tokens.colorBrandForeground1,
    marginBottom: tokens.spacingVerticalL,
  },
  timer: {
    fontSize: tokens.fontSizeBase600,
    color: tokens.colorNeutralForeground2,
    marginBottom: tokens.spacingVerticalL,
  },
  buttonGroup: {
    marginTop: tokens.spacingVerticalL,
  },
});

export const SpeakingPractice: React.FC<SpeakingPracticeProps> = ({
  questionTimeout = 3000,
  answerTimeout = 4000,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [timer, setTimer] = React.useState<number>(questionTimeout / 1000);

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setTimeout>;

    if (isPlaying) {
      // 设置计时器显示
      intervalId = setInterval(() => {
        setTimer((prev) => Math.max(0, prev - 1));
      }, 1000);

      // 显示答案
      timeoutId = setTimeout(() => {
        setShowAnswer(true);
        setTimer(answerTimeout / 1000);

        // 显示下一个句子
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % mockData.length);
          setShowAnswer(false);
          setTimer(questionTimeout / 1000);
        }, answerTimeout);
      }, questionTimeout);
    }

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [currentIndex, isPlaying, questionTimeout, answerTimeout]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetPractice = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setIsPlaying(false);
    setTimer(questionTimeout / 1000);
  };

  const playAudio = () => {
    const currentSentence = mockData[currentIndex];
    if (currentSentence.audioUrl) {
      const audio = new Audio(currentSentence.audioUrl);
      audio.play().catch((error) => console.error('播放音频失败:', error));
    }
  };

  const styles = useStyles();

  return (
    <div
      className={`${styles.stack} min-w-[800px] min-h-[300px] bg-slate-200 border-spacing-5`}
    >
      <Card className={`${styles.card} p-5 flex flex-col min-h-screen`}>
        <CardHeader header={<Title1>表达练习</Title1>} className="h-[30%]" />
        <div className="h-[70%] min-h-[300px]">
          <div className="flex flex-col min-h-[300px] p-2 pt-10 justify-center items-center">
            <div>
              <Text className={styles.question} align="center">
                {mockData[currentIndex].question}
              </Text>
            </div>
            {showAnswer && (
              <div className="mt-5 ">
                <hr />
                <div className="p-6">
                  <Text className={`${styles.answer} `} align="center">
                    {mockData[currentIndex].answer}
                  </Text>
                </div>
              </div>
            )}
          </div>
          <div>
            <Label className={styles.timer}>{timer}秒</Label>
          </div>
          <div
            className={`${styles.buttonGroup} flex items-start gap-x-10 mt-auto`}
          >
            <Button appearance="primary" onClick={togglePlay}>
              {isPlaying ? '暂停' : '开始'}
            </Button>
            <Button className="primary" onClick={resetPractice}>
              重置
            </Button>
            <Button
              className="rounded-full"
              size="small"
              shape="circular"
              onClick={playAudio}
            >
              <PlayCircleRegular fontSize={32} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const mockData: Sentence[] = [
  {
    id: 1,
    question: '你好',
    answer: 'こんにちは',
    audioUrl: '/audio/konnichiwa.mp3',
  },
  {
    id: 2,
    question: '谢谢',
    answer: 'ありがとう',
    audioUrl: '/audio/arigatou.mp3',
  },
  {
    id: 3,
    question: '再见',
    answer: 'さようなら',
    audioUrl: '/audio/sayounara.mp3',
  },
];
