import { useState } from 'react';
import { BabylonScene } from './game/BabylonScene';
import { HudShell } from './ui/HudShell';

export function App() {
    const [score, setScore] = useState<number>(0);
    const [lives, setLives] = useState<number>(3);
    const [questionText, setQuestionText] = useState<string>('3 + 4');

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#0f172a' }}>
            <BabylonScene 
                onScoreUpdate={setScore}
                onLivesUpdate={setLives}
                onQuestionUpdate={setQuestionText}
            />
            <HudShell 
                score={score}
                lives={lives}
                questionText={questionText}
            />
        </div>
    );
}

export default App;
