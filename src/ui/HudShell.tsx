import React from 'react';

interface HudShellProps {
    score: number;
    lives: number;
    questionText: string;
}

export const HudShell: React.FC<HudShellProps> = ({ score, lives, questionText }) => {
    const hearts = '❤️'.repeat(Math.max(0, lives));

    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, width: '100vw', height: '100vh',
            pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            padding: '24px', boxSizing: 'border-box', fontFamily: '"Segoe UI", Roboto, Helvetica, sans-serif'
        }}>
            {/* Top Bar: Lives & Score */}
            <div style={{ display: 'flex', justifyContent: 'space-between', pointerEvents: 'auto', alignItems: 'center' }}>
                <div style={{ 
                    background: 'rgba(24, 59, 99, 0.9)', 
                    padding: '10px 20px', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(255, 246, 216, 0.3)', 
                    fontSize: '18px',
                    color: '#FFF6D8',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                    Lives: {hearts}
                </div>
                <div style={{ 
                    background: 'rgba(24, 59, 99, 0.9)', 
                    padding: '10px 20px', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(255, 246, 216, 0.3)',
                    color: '#FFF6D8',
                    fontWeight: '600',
                    fontSize: '18px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                    🏆 Score: {score}
                </div>
            </div>

            {/* Center Question Board: Modern Card Styling */}
            <div style={{ alignSelf: 'center', pointerEvents: 'auto' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #183B63 0%, #0f253f 100%)',
                    padding: '16px 42px',
                    borderRadius: '20px',
                    border: '2px solid #FFF6D8',
                    color: '#FFF6D8',
                    fontSize: '32px',
                    fontWeight: '800',
                    letterSpacing: '1px',
                    textAlign: 'center',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255,255,255,0.1)'
                }}>
                    {questionText} = ?
                </div>
            </div>

            {/* Bottom Hint */}
            <div style={{ 
                alignSelf: 'center', 
                fontSize: '14px', 
                color: '#183B63', 
                background: 'rgba(255, 246, 216, 0.9)', 
                padding: '6px 16px', 
                borderRadius: '8px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                Use Left/Right Arrow keys or A/D to steer into the correct answer gate!
            </div>
        </div>
    );
};
