import * as PIXI from 'pixi.js';

export default class Loader {
    public loader: PIXI.Loader;
    private app: PIXI.Application;
    private loadingScreen: PIXI.Text;
    private onAssetsLoaded: () => void;

    constructor(app: PIXI.Application, onAssetsLoaded: () => void) {
        this.app = app;
        this.loader = app.loader;
        this.onAssetsLoaded = onAssetsLoaded;
        
        this.init();
        
    }

    private init() {
        this.loadAssets();
        this.createLoadingScreen(this.app.screen.width, this.app.screen.height);
        this.app.stage.addChild(this.loadingScreen);

        this.loader.load(() => {
            this.app.stage.removeChild(this.loadingScreen);
            this.onAssetsLoaded();
        });
    }

    private loadAssets() {
        this.loader.add('symbols', 'assets/images/symbols/symbols.json');
        this.loader.add('background', 'assets/images/main/background.jpg');
    }

    private createLoadingScreen(appWidth: number, appHeight: number) {
        const style = new PIXI.TextStyle({
            fontFamily: 'Questrial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: '#ffffff',
        });
        const playText = new PIXI.Text('Loading...', style);
        playText.x = (appWidth - playText.width) / 2;
        playText.y = (appHeight - playText.height) / 2;
        this.loadingScreen = playText;
    }
}
