export class InputManager {
    private onLaneChange: (direction: 'left' | 'right') => void;
    private handleKeyDown: (event: KeyboardEvent) => void;

    constructor(onLaneChange: (direction: 'left' | 'right') => void) {
        this.onLaneChange = onLaneChange;

        this.handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft' || event.key === 'KeyA' || event.key === 'a' || event.key === 'A') {
                this.onLaneChange('left');
            } else if (event.key === 'ArrowRight' || event.key === 'KeyD' || event.key === 'd' || event.key === 'D') {
                this.onLaneChange('right');
            }
        };

        window.addEventListener('keydown', this.handleKeyDown);
    }

    public dispose() {
        window.removeEventListener('keydown', this.handleKeyDown);
    }
}
