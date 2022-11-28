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
        this.loader.add('home', 'assets/images/home/home.json');
        this.loader.add('scene', 'assets/images/scene/scene.json');
        this.loader.add('slot', 'assets/images/slot/slot.json');
        this.loader.add('plinko', 'assets/images/plinko/plinko.json');
        this.loader.add('crane', 'assets/images/plinko/crane.json');
        this.loader.add('bottom', 'assets/images/scene/bottom/bottom.json');
        this.loader.add('playbutton', 'assets/images/home/playbutton.json');
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
